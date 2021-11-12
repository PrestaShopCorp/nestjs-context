import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Request } from 'express';
import { ContextModule, ContextName } from '../../../src';
import { ExampleController } from './example.controller';
import { ExampleHandler } from './example.handler';
import { ExampleService } from './example.service';

@Module({
  providers: [ExampleHandler, ExampleService],
  imports: [
    ContextModule.register({
      type: ContextName.HTTP,
      build: {
        'multi_level.value': ['my-value'],
        host_from_header: ['req.headers.host'],
        environment_from_value_or_query_or_header: [
          'req.headers.environment',
          'req.query.environment',
          process.env.NODE_ENV,
        ],
        from_callback: [(req: Request) => `callback:${req.body.id}`],
      },
    }),
    CqrsModule,
  ],
  controllers: [ExampleController],
})
export class ExampleModule {}
