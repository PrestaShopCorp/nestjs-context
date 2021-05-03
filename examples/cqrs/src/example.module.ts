import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Request } from 'express';
import { ContextModule, ContextName } from '../../../src';
import { ExampleController } from './example.controller';
import { ExampleContextPropertyProvider } from './example-context-property.provider';
import { ExampleHandler } from './example.handler';

@Module({
  providers: [ExampleHandler],
  imports: [
    ContextModule.registerWithDefaults({
      type: ContextName.HTTP,
      build: {
        'multi_level.value': ['my-value'],
        host_from_header: ['req.headers.host'],
        environment_from_value_or_query_or_header: [
          'req.headers.environment',
          'req.query.environment',
          process.env.NODE_ENV,
        ],
        from_provider: [ExampleContextPropertyProvider],
        from_callback: [(req: Request) => `callback:${req.body.id}`],
      },
      providers: [ExampleContextPropertyProvider],
    }),
    CqrsModule,
  ],
  controllers: [ExampleController],
})
export class ExampleModule {}
