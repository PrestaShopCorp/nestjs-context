import { Module } from '@nestjs/common';
import { Request } from 'express';
import { ContextModule } from '../../../src/context.module';
import { ExampleController } from './example.controller';
import { ExecutionContext } from '../../../src/interfaces';
import { ExampleContextPropertyProviderService } from './example-context-property-provider.service';

@Module({
  imports: [
    ContextModule.registerWithDefaults(
      ExecutionContext.HTTP,
      {
        from_value: ['my-value'],
        from_header: ['headers.host'],
        from_value_or_query_or_header: [
          'headers.environment',
          'query.environment',
          process.env.NODE_ENV,
        ],
        from_provider: [ExampleContextPropertyProviderService],
        from_callback: [(req: Request) => `custom-fx-id:${req.body.id}`],
      },
      [ExampleContextPropertyProviderService],
    ),
  ],
  controllers: [ExampleController],
})
export class ExampleModule {}
