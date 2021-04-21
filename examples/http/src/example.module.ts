import { Module } from '@nestjs/common';
import { Request } from 'express';
import { ContextModule, ContextName } from '../../../src';
import { ExampleController } from './example.controller';
import { ExampleContextPropertyProvider } from './example-context-property.provider';

@Module({
  imports: [
    ContextModule.registerWithDefaults({
      type: ContextName.HTTP,
      build: {
        from_value: ['my-value'],
        from_header: ['headers.host'],
        from_value_or_query_or_header: [
          'headers.environment',
          'query.environment',
          process.env.NODE_ENV,
        ],
        from_provider: [ExampleContextPropertyProvider],
        from_callback: [(req: Request) => `callback:${req.body.id}`],
      },
      providers: [ExampleContextPropertyProvider],
    }),
  ],
  controllers: [ExampleController],
})
export class ExampleModule {}
