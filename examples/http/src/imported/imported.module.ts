import { Module } from '@nestjs/common';
import { ContextModule, ContextName } from '../../../../src';
import { ImportedController } from './imported.controller';
import { ImportedService } from './imported.service';
import { ImportedPropertyProvider } from './imported-property.provider';

const providers = [ImportedPropertyProvider, ImportedService];
@Module({
  imports: [
    ContextModule.register({
      type: ContextName.HTTP,
      build: {
        value: ['inside-imported'],
        provided: [ImportedPropertyProvider],
      },
      providers,
    }),
  ],
  controllers: [ImportedController],
  providers: [ImportedService],
  exports: [ImportedService],
})
export class ImportedModule {}
