import { Module } from '@nestjs/common';
import { Request } from 'express';
import { ContextModule, ContextName } from '../../../src';
import { ExampleController } from './example.controller';
import { ExampleContextPropertyProvider } from './example-context-property.provider';
import { ExampleImportedModule } from './example-imported.module';

@Module({
  imports: [
    ExampleImportedModule,
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
  ],
  controllers: [ExampleController],
})
export class ExampleModule {}
