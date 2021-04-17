# NestJs Context Module

NestJs request scoped context to access execution context request information anywhere

## About

This project includes:

* A Context service that allows to access execution context request information anywhere
* @BuildDto that allows to build data transfer objects from all the parts of the execution 
  context request with a simple configuration
* @CorrelationId PropertyDecorator that allows to insert the execution context request 
  correlation-id into class property.
* @AddCorrelationId ClassDecorator that allows to insert the execution context request 
  correlation-id into a class property or sub-property 

## Examples
   
- [HTTP](./examples/http)
- [GPL - TODO](./examples/gpl)
- [RPC - TODO](./examples/rpc)

## Basic Usage

* Import the module and configure your context properties:
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


## Reporting issues

Create an [issue](https://github.com/PrestaShopCorp/nesjs-context/issues).


## Ressources

* [contributors](https://github.com/PrestaShopCorp/nesjs-context/graphs/contributors)

## TODO (WIP)

* Unit Tests 
* Add HTTP context defaults
* CQL context
* RPC context
* Only tested with Express: try it on other platforms
