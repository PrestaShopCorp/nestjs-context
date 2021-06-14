import { Module } from '@nestjs/common';
import { Request } from 'express';
import { ContextConfigType, ContextName } from '../../../src';
import { ExampleController } from './example.controller';
import { ExamplePropertyProvider } from './providers/example-property.provider';
import { ImportedModule } from './imported/imported.module';
import { ExampleProvider } from './providers/example.provider';
import { convertToContextModule } from '../../../src';

const contextConfig = {
  cached: true,
  global: false, // change this value to see the side-effects
  addDefaults: true, // change this value to see the side-effects
  type: ContextName.HTTP,
  build: {
    'multi_level.value': ['my-value'],
    'single\\.level\\.value': ['my-value'],
    host_from_header: ['req.headers.host'],
    environment_from_value_or_query_or_header: [
      'req.headers.environment',
      'req.query.environment',
      process.env.NODE_ENV,
    ],
    from_provider: [ExamplePropertyProvider],
    from_callback: [(req: Request) => `callback:${req.body.id}`],
  },
  correlation_id: {
    //header: 'use-this-instead-of-x-correlation-id',
    generator: true,
  },
} as ContextConfigType;

@Module({})
export class ExampleModule {
  static register() {
    return convertToContextModule(
      {
        providers: [ExampleProvider, ExamplePropertyProvider],
        imports: [ImportedModule],
        controllers: [ExampleController],
      },
      contextConfig,
    );
  }
}
