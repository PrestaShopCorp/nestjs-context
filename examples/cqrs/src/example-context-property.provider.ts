import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { IContextPropertyProvider } from '../../../src';

@Injectable()
export class ExampleContextPropertyProvider
  implements IContextPropertyProvider {
  get(request: Request) {
    return `provider:${request.body.id}`;
  }
}
