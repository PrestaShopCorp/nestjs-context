import { Injectable } from '@nestjs/common';
import { NestMiddleware } from '@nestjs/common';
import {
  CONTEXT_CORRELATION_ID,
  HEADER_CORRELATION_ID,
} from '../constants';
import { generateId } from '../tools';
import { Context } from '../context';

@Injectable()
export class GenerateCorrelationIdMiddleware implements NestMiddleware {

  constructor(
    private readonly context: Context,
  ) {}

  protected generateCorrelationId(request) {
    if (!request.headers[HEADER_CORRELATION_ID]) {
      const correlationId = generateId();
      request.headers[HEADER_CORRELATION_ID] = correlationId;
      this.context.setCachedValue(CONTEXT_CORRELATION_ID, correlationId);
    }
  }

  use(req: any, res: any, next: () => void) {
    this.generateCorrelationId(req);
    next();
  }
}
