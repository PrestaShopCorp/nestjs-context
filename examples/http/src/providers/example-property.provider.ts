import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import {
  Context,
  CONTEXT_CORRELATION_ID,
  IContextPropertyProvider,
} from '../../../../src';
import { ImportedService } from '../imported/imported.service';

@Injectable()
export class ExamplePropertyProvider implements IContextPropertyProvider {
  constructor(
    private readonly ctx: Context,
    private readonly service: ImportedService,
  ) {}
  get(request: Request) {
    this.service.debug();
    return `provider:${request.body.id}-${this.ctx.get(
      CONTEXT_CORRELATION_ID,
    )}`;
  }
}
