import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { startCase } from 'lodash';
import {
  CONTEXT_CORRELATION_ID,
  CONTEXT_MODULE_CONFIG,
  HEADER_CORRELATION_ID,
} from '../constants';
import { Context } from '../context';
import { ConfigType } from '../interfaces';

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  constructor(
    private readonly context: Context,
    @Inject(CONTEXT_MODULE_CONFIG) private readonly config: ConfigType,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const headerName =
      this.config?.correlation_id?.header ?? HEADER_CORRELATION_ID;
    if (this.context.get(CONTEXT_CORRELATION_ID)) {
      context
        .switchToHttp()
        .getResponse()
        .set(
          startCase(headerName).replace(/ /g, '-'),
          this.context.get(CONTEXT_CORRELATION_ID),
        );
    }
    return next.handle();
  }
}
