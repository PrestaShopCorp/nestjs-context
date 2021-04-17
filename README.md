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
import { GetUser, GetShopId } from './context-providers';

@Module({
  imports: [
    ContextModule.registerWithDefaults(
      ContextName.HTTP,
      {
        my_value: ['my-value'],
        host: ['headers.host'],
        node_env: [process.env.NODE_ENV],
        shop_id: ['headers.shop_id', GetShopId()]
        user: [GetUser],
        entity_id: [(req: Request) => req.body.id],
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

### Using the @BuildDto decorator

You can use @BuildDto in your controllers to build a dto using different parts of the request
at once. The decorator receives as argument an object where the keys will be the dto properties, 
and the values are LIFO of possible values for that property. A value can be defined with: 

1. A custom string or numeric value (fex: 35)
2. A path representing a path inside the request (fex: "body.id")
3. A callback that will receive the request as argument
4. A provider implementing
   [IContextPropertyProvider](./src/interfaces/context-property-provider.interface.ts).
   Provider::get will be called to build the value, passing request and property key as arguments.
   
As possible values are LIFO if the last value was null or undefined it will take the previous one, and so successively:

```typescript
export class ExampleController {
  // if body.id is undefined or null, dto_id will be set to query.id; 
  // if both are null or undefined, it will be set to "EMPTY"
  async example1(@BuildDto({dto_id: ['EMPTY', 'query.id', 'body.id']}) dto: ExampleDto) {
    // your code
  }
}
```
The previous example will only work for HTTP context, but there is another version of the call that allows us 
to: 
- customise the context type 
- add an "auto" build for the dto -we need to pass the target dto


```typescript
export class ExampleController {
  @Post('/example')
  // this will try to build all the elements of ExampleDto from the query string
  // and then will override dto_id with body.id, if it exists
  async example(
    @BuildDto({
      type: ContextName.HTTP,
      target: ExampleDto,
      build: { dto_id: ['body.id'] },
      auto: { enabled: true, path: 'query' },
    })
      dto: ExampleDto,
  ) {
    // your code
  }
}
```

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

* Use custom param decorator instead of 
  [createParamDecorator](https://github.com/nestjs/nest/blob/master/packages/common/decorators/http/create-route-param-metadata.decorator.ts)
* Unit Tests 
* Add HTTP context defaults
* CQL context
* Processors ? (setCorrelationId ?)
* RPC context
* Do we need anything else to integrate with nestjs-geteventstore ? (CorrelationIdMetadata ?)
* Only tested with Express: try it on other platforms
