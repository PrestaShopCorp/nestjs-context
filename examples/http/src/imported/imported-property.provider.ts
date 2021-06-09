import { Injectable } from '@nestjs/common';
import { IContextPropertyProvider } from '../../../../src';
import { ImportedService } from './imported.service';

@Injectable()
export class ImportedPropertyProvider implements IContextPropertyProvider {
  constructor(private readonly service: ImportedService) {}
  get() {
    this.service.debug();
    return 'imported-property-provider';
  }
}
