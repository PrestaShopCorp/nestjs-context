import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import {
  Context,
  CONTEXT_CORRELATION_ID,
  IContextPropertyProvider,
} from '../../../src';

@Injectable()
export class ExampleContextPropertyProvider
  implements IContextPropertyProvider {
  constructor(private readonly ctx: Context) {}
  get(request: Request) {
    return `provider:${request.body.id}-${this.ctx.get(
      CONTEXT_CORRELATION_ID,
    )}`;
  }
}
