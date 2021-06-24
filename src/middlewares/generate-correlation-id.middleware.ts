import { Inject, Injectable } from '@nestjs/common';
import { NestMiddleware } from '@nestjs/common';
import {
  CONTEXT_CORRELATION_ID,
  CONTEXT_MODULE_CONFIG,
  HEADER_CORRELATION_ID,
} from '../constants';
import { ContextConfigType } from '../interfaces';
import { correlationIdGenerator } from '../tools';
import { Context } from '../context';

@Injectable()
export class GenerateCorrelationIdMiddleware implements NestMiddleware {
  constructor(
    private readonly context: Context,
    @Inject(CONTEXT_MODULE_CONFIG) private readonly config: ContextConfigType,
  ) {}
  protected generateCorrelationId(request) {
    if (!request.headers[HEADER_CORRELATION_ID]) {
      const correlationId = correlationIdGenerator();
      request.headers[HEADER_CORRELATION_ID] = correlationId;
      this.context.setCachedValue(CONTEXT_CORRELATION_ID, correlationId);
    }
  }
  use(req: any, res: any, next: () => void) {
    this.generateCorrelationId(req);
    next();
  }
}
