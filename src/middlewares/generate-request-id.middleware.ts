import { Inject, Injectable } from '@nestjs/common';
import { NestMiddleware } from '@nestjs/common';
import { CONTEXT_MODULE_CONFIG, HEADER_REQUEST_ID } from '../constants';
import { ContextConfigType } from '../interfaces';
import { generateId } from '../tools';
import { Context } from '../context';

@Injectable()
export class GenerateRequestIdMiddleware implements NestMiddleware {
  constructor(
    private readonly context: Context,
    @Inject(CONTEXT_MODULE_CONFIG) private readonly config: ContextConfigType,
  ) {}
  use(req: any, res: any, next: () => void) {
    req.headers[HEADER_REQUEST_ID] = generateId();
    next();
  }
}
