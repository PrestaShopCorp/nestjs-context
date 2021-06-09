import { Module } from '@nestjs/common';
import { ContextModule, ContextName } from '../../../../src';
import { ImportedController } from './imported.controller';
import { ImportedService } from './imported.service';

@Module({
  imports: [
    ContextModule.register({
      type: ContextName.HTTP,
      build: {
        value: ['inside-imported'],
      },
    }),
  ],
  controllers: [ImportedController],
  providers: [ImportedService],
  exports: [ImportedService],
})
export class ImportedModule {}
