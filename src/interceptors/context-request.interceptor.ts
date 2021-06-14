import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Context, getContextRequest } from '../context';
import { CONTEXT_MODULE_CONFIG } from '../constants';
import { ContextConfigType } from '../interfaces';
import { Logger } from '@nestjs/common';

@Injectable()
export class ContextRequestInterceptor implements NestInterceptor {
  private logger = new Logger(ContextRequestInterceptor.name);
  constructor(
    private readonly context: Context,
    @Inject(CONTEXT_MODULE_CONFIG) private readonly config: ContextConfigType,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.context.setRequest(getContextRequest(this.config.type, context));
    this.logger.debug(`Context request set: ${!!this.context.request}`);
    return next.handle().pipe(
      tap(() => {
        this.logger.debug('Clear context...');
        this.context.setRequest(null);
        this.context.clear();
      }),
    );
  }
}
