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
    ContextModule.registerWithDefaults(
      ContextName.HTTP,
      {
        host: ['headers.host'], // request path
        node_env: [process.env.NODE_ENV], // value
        user: ['anon.', GetUser], // provider with fallback
        entity: [(req: Request) => `${req.params.entity}_${req.params.id}`], //callback
      },
      [GetUser, GetShopId],
    ),
  ],
})
export class ExampleModule {}
```

You could also use ```ContextModule.register```, but we recommend using the defaults as they will
automatically add useful information to your context (fex: correlation-id). 
Check the [defaults](src/tools/add-context-defaults.ts) for more information.

The context will be built through the definition given as second argument during the module registration;
It is an object where the keys will be the context properties, and the values are LIFO of possible 
values for that property. A value can be defined using:

1. A custom string or numeric value (fex: 35)
2. A path inside the request (fex: "body.id")
3. A callback that will receive the request as argument
4. A provider implementing
   [IContextPropertyProvider](./src/interfaces/context-property-provider.interface.ts).
   Provider::get will be called to build the value, passing request and property key as arguments to it.

As possible values are LIFO, if the last value was null or undefined the context will try with the previous one, 
and so successively

### Using the @BuildDto decorator

You can use @BuildDto in your controllers to build a dto using different parts of the request
at once. The decorator receives as an argument a definition with the same format as for the context
construction:

```typescript
export class ExampleController {
  // if body.id is undefined or null, dto_id will be set to query.id; 
  // if both are null or undefined, it will be set to "EMPTY"
  async example1(@BuildDto({dto_id: ['EMPTY', 'query.id', 'body.id']}) dto: ExampleDto) {
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
      build: { "id": "params.id", "child.id": ['params.child_id'] },
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
- [Check here](./src/tools/get-context-default-auto-build.path.ts) 
  the default auto-build path for each context.


### Getting the correlation-id into class property 
- Note: this decorator converts your object property into an accessor descriptor instead of 
data descriptor.
- Note: you must use "declare" if you have declared "useDefineForClassFields": true in your
tsconfig
```typescript
import { CorrelationId } from 'nestjs-context'; 

export class InternalServerErrorException {
  @CorrelationId()
  private declare readonly correlationId;
}
```

### Getting the correlation-id into class sub-property
- Note: this decorator converts your object property into an accessor descriptor instead of
data descriptor, and it will use another data descriptor as backup for the rest of 
sub-properties
```typescript
import { AddCorrelationId } from 'nestjs-context';

@AddCorrelationId('property.correlation_id')
export class ExampleClass {
  private readonly property; // property.correlation_id will be created
}
```

## Reporting issues

Create an [issue](https://github.com/PrestaShopCorp/nesjs-context/issues).

## Ressources

* [contributors](https://github.com/PrestaShopCorp/nesjs-context/graphs/contributors)

## WIP

* Unit Tests 
* Add HTTP context defaults
* CQL context
* Processors ? (setCorrelationId ?)
* RPC context
* Do we need anything else to integrate with nestjs-geteventstore ? (CorrelationIdMetadata ?)
* Only tested with Express: try it on other platforms

## TODO
* Use custom param decorator instead to receive the target as argument instead of using
  [createParamDecorator](https://github.com/nestjs/nest/blob/master/packages/common/decorators/http/create-route-param-metadata.decorator.ts)
  => so we can remove "target" in full BuildDto calls
