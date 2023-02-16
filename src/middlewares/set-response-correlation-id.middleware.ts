import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { startCase } from 'lodash';
import {
  CONTEXT_CORRELATION_ID,
  CONTEXT_MODULE_CONFIG,
  HEADER_CORRELATION_ID,
} from '../constants';
import { Context } from '../context';
import { ContextConfigType } from '../interfaces';
import { NestMiddleware } from '@nestjs/common';

@Injectable()
export class SetResponseCorrelationIdMiddleware implements NestMiddleware {

  constructor(
    private readonly context: Context,
    @Inject(CONTEXT_MODULE_CONFIG) private readonly config: ContextConfigType,
  ) {}

  protected setResponseCorrelationId(response: any) {
    const headerName = startCase(
      this.config?.correlation_id?.header ?? HEADER_CORRELATION_ID,
    ).replace(/ /g, '-');
    if (!!this.context.get(CONTEXT_CORRELATION_ID)) {
      response.set(
        startCase(headerName).replace(/ /g, '-'),
        this.context.get(CONTEXT_CORRELATION_ID),
      );
    }
  }

  use(req: any, res: any, next: () => void) {
    this.setResponseCorrelationId(res);
    next();
  }
}
