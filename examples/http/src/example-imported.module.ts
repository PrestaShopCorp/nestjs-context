import { Module } from '@nestjs/common';
import { ContextModule, ContextName } from '../../../src';
import { ExampleImportedController } from './example-imported.controller';

@Module({
  imports: [
    ContextModule.registerWithDefaults(
      {
        type: ContextName.HTTP,
        build: {
          value: ['inside-imported'],
        },
      },
      false,
    ),
  ],
  controllers: [ExampleImportedController],
})
export class ExampleImportedModule {}
