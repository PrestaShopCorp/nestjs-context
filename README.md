# NestJs Context Module

NestJs (request-scoped) context to access execution-context-request information everywhere

## About

This project includes:

* A Context service that allows to get execution-context-request customised information 
  in your providers in the same way, no matter the execution-context type.
* @BuildDto that allows to build data-transfer-objects from the active 
  execution-context-request with a simple configuration
* @CorrelationId PropertyDecorator that allows to insert the execution-context-request 
  correlation-id into class property.
* @AddCorrelationId ClassDecorator that allows to insert the execution-context-request 
  correlation-id into a class property or sub-property 

## Examples
   
- [HTTP](./examples/http)
- [GPL - TODO](./examples/gpl)
- [RPC - TODO](./examples/rpc)

## Basic Usage

```typescript
import { Module, Logger } from '@nestjs/common';
import { ContextModule } from 'nesjs-context';
import { GetUser } from './context-providers';

@Module({
  imports: [
    ContextModule.register(),
  ],
})
export class ExampleModule {}
```

- Check all the [config options](src/interfaces/context-config.type.ts) for further information about available
  configurations
- Check the [defaults](src/context/add-context-config-defaults.ts) for further information about defaults


## Advanced Usage

### Custom Context Properties

```typescript
import { Module, Logger } from '@nestjs/common';
import { ContextModule } from 'nesjs-context';
import { GetUser } from './context-providers';

@Module({
  imports: [
    ContextModule.register({
      global: false,          // false by default; if true, it will be used for every module using ContextModule
      cached: true,           // false by default; the values are calculated only once per request
      useDefaults: true,      // true by default; adds useful defaults to the context
      type: ContextName.HTTP, // Http by default
      build: {                // empty by default
        host: ['localhost', 'req.headers.host'], // request path with fallback to "localhost"
        node_env: [process.env.NODE_ENV], // value
        entity: [(req: Request) => `${req.params.entity}_${req.params.id}`], // callback
      },
    }),
  ],
})
export class ExampleModule {}
```

The context object uses the "build" definition from the config to pick elements from 
the request. That is an object where the keys are the resulting context properties, and the 
values are LIFO of possible values for that property. A value can be defined using:

1. A custom string or numeric value (fex: 35)
2. A path inside the request, using "req" as first key (fex: "req.body.id")
3. A callback that will receive the request as argument
4. A provider** implementing
   [IContextPropertyProvider](./src/interfaces/context-property-provider.interface.ts).
   Provider::get will be called to build the value, passing request and property key as arguments to it
   
** It is a special case - see Context with Dependency injection for examples

As possible values are LIFO, if the last value was null or undefined the context will try with the previous one, 
and so successively. You can manually set values into context calling "Context::setCachedValue": set values will 
take precedence over any other declared possible values.


### Context with Dependency injection: provided properties

The simplest way to add a property provider in your context is passing the "providers" to the context module.
Notice that you will also need to pass its dependencies too:
```typescript
@Module({
  imports: [
    ContextModule.register({
      type: ContextName.HTTP,
      build: {
        value: ['inside-imported'],
        provided: [PropertyProvider],
      },
      // as PropertyProviders depends on PropertyProviderService, we pass both providers
      providers: [PropertyProvider, PropertyProviderService],
    }),
  ],
  controllers: [ImportedController],
  providers: [ImportedService],
  exports: [ImportedService],
})
export class ExampleModule {}
```

You could also pass "imports" to get all the exported providers from the given modules:
```typescript
@Module({
  imports: [
    ContextModule.register({
      type: ContextName.HTTP,
      build: {
        value: ['inside-imported'],
        provided: [PropertyProvider],
      },
      providers: [PropertyProvider],
      // as PropertyProviders depends on MyModule, we pass the module too
      imports: [MyModule.register()]
    }),
  ],
  controllers: [ImportedController],
  providers: [ImportedService],
  exports: [ImportedService],
})
export class ExampleModule {}
```

It can be tedious to pass every dependency to the context. Especially at the application level, where you may be 
adding the same dependencies to the context module and to the application main module. To reduce the boilerplate,
we can convert our app to be a ContextModule itself, so the ModuleRef of the Context will be the same as the main
module:
```typescript
import {ContextConfigType} from "./context-config.type";

const contextConfig: ContextConfigType = {
  global: true, //this will cause the imported module contexts to use the main context instead
  type: ContextName.HTTP, 
  build: {
    host: ['req.headers.host'], // request path
    node_env: [process.env.NODE_ENV], // value
    entity: [(req: Request) => `${req.params.entity}_${req.params.id}`], // callback
        user: ['anon.', GetUser], // provider with fallback to "anon."
  },
};

@Module({})
export class ExampleModule {
  static register() {
    return convertToContextModule(
      {
        providers: [ExampleProvider, GetUser],
        imports: [ImportedModule],
        controllers: [ExampleController],
      },
      contextConfig,
    );
  }
}
```
Be careful: by default, "convertToContextModule" will set your module name to "ContextModule", if you are using 
it for a module that is not the main module of the application, it could cause your module to be ignored -in the
case there is another "global" context module that is being loaded before-. If you want to keep your module name 
instead and to keep unique context for your application, you must specify it explicitly: 
```typescript
@Module({})
export class ExampleModule {
  static register() {
    return {
      ...convertToContextModule(
        {
          providers: [ExampleProvider, GetUser],
          imports: [ImportedModule],
          controllers: [ExampleController],
        },
        contextConfig,
      ),
      module: ExampleModule
    };
  }
}
```

### Generating the correlation-id automatically

If you need to include a correlation_id in your context, even if the x-correlation-id header is not included, 
you can use a correlation_id generator as callback: 

Notice that everytime we have a Context::correlation_id, it will be included in the http response headers.

```typescript
import { Module, Logger } from '@nestjs/common';
import { ContextModule } from 'nesjs-context';
import { GetUser } from './context-providers';

@Module({
  imports: [
    ContextModule.registerWithDefaults({
      type: ContextName.HTTP,
      build: {},
      correlation_id: {
        //header: 'my-header', // use "my-header" instead of X-Correlation-Id as reference header
        generator: true // there is a default correlation_id generator inside the module
        // generator: (req) => 'generated-correlation-id' // but you can also use a custom one
      },
    }),
  ],
})
export class ExampleModule {}
```

### Getting the correlation-id into a class property 

- Note: you need to add Context as DI to use this decorator
- Note: this decorator converts your object property into an accessor descriptor instead of 
data descriptor.
- Note: you must use "declare" if you have declared "useDefineForClassFields": true in your
tsconfig
```typescript
import { CorrelationId } from 'nestjs-context'; 

@Injectable()
export class MyProvider {
  @CorrelationId()
  private declare readonly correlationId;
  constructor(private readonly ctx: Context) {}
}
```

### Getting the correlation-id into class sub-property

- Note: you need to add Context as DI to use this decorator
- Note: this decorator converts your object property into an accessor descriptor instead of
data descriptor, and it will use another data descriptor as backup for the rest of sub-properties
```typescript
import { AddCorrelationId } from 'nestjs-context';

@Injectable()
@AddCorrelationId('property.correlation_id')
export class MyProvider {
  private readonly property; // property.correlation_id will be created
  constructor(private readonly ctx: Context) {}
}
```

## Using the @BuildDto decorator

You can use @BuildDto in your controllers to build a dto using different parts of the request
at once. The decorator receives as an argument a definition with the same format as for the context
construction (except for the provider definition, still not working -see WIP-):

```typescript
export class ExampleController {
  // if body.id is undefined or null, dto_id will be set to query.id; 
  // if both are null or undefined, it will be set to "EMPTY"
  async example1(@BuildDto({dto_id: ['EMPTY', 'req.query.id', 'req.body.id']}) dto: ExampleDto) {
    // your code
  }
}
```
The previous example will only work for HTTP execution context, but there is another version of the call that
allows us to:
- customise the context type
- add an "auto" build for the dto


```typescript
export class ExampleController {
  @Post('/example')
  // This will try to build all the elements of ExampleDto from the body
  // and then it will override "dto::child::id" with params.child_id, if it is defined
  // and dto::id with params.id, if it is defined
  async example(
    @BuildDto({
      target: ExampleDto,
      type: ContextName.HTTP,
      build: { "id": "req.params.id", "child.id": ['req.params.child_id'] },
      auto: { enabled: true, path: 'body', is_fallback: true },
    })
      dto: ExampleDto,
  ) {
    // your code
  }
}
```
- By default, auto build is disabled.
- By default, the properties declared in "build" are excluded from "auto" build, if you want to include
  auto-build as a fallback of the "build" properties, just set ```is_fallback: true```.
- Every context has a default request "path" ([more info here](src/helpers/context/get-context-default-auto-build-path.ts))
  to look for the auto-built properties. Note that here it is not necessary to include the "req." prefix.

### Attention!

@BuildDto needs you to configure tsconfig with ```useDefineForClassFields: true``` or
```strictPropertyInitialization: true```. Without any of those configs, any declared and not initialised
property in your DTO won't be taken into account when building the DTO

## Reporting issues

Create an [issue](https://github.com/PrestaShopCorp/nesjs-context/issues).

## Resources

* [contributors](https://github.com/PrestaShopCorp/nesjs-context/graphs/contributors)

## WIP

* GQL context
* Processors ? (setCorrelationId ?)
* RPC context
* Can we add the ModuleRef DI to @BuildDto using @SetMetadata + explorer ?
* Can we use the Context service instead of creating a new Context in @BuildDto ?
* Created for Express: adapt it to work on other platforms
* Modify createRouteParam / use custom param decorator to receive the target as argument instead of using
  [createParamDecorator](https://github.com/nestjs/nest/blob/master/packages/common/decorators/http/create-route-param-metadata.decorator.ts)
  => so we can remove "target" in full BuildDto calls
  
