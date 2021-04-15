import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ProviderInterface } from '../../../src/interfaces';

@Injectable()
export class ExampleContextPropertyProviderService
  implements ProviderInterface {
  get(request: Request) {
    return `provider-id:${request.body.id}`;
  }
}
