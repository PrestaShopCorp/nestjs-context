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

@Injectable()
export class ContextRequestInterceptor implements NestInterceptor {
  constructor(
    private readonly context: Context,
    @Inject(CONTEXT_MODULE_CONFIG) private readonly config: ContextConfigType,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.context.setRequest(getContextRequest(this.config.type, context));
    return next.handle().pipe(
      tap(() => {
        this.context.setRequest(null);
        this.context.clear();
      }),
    );
  }
}
