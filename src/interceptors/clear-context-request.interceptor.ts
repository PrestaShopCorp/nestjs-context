import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Context } from '../context';
import { CONTEXT_MODULE_CONFIG } from '../constants';
import { ContextConfigType } from '../interfaces';

@Injectable()
export class ClearContextRequestInterceptor implements NestInterceptor {
  constructor(
    private readonly context: Context,
    @Inject(CONTEXT_MODULE_CONFIG) private readonly config: ContextConfigType,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // @todo jdm this is not working ! check how to do it for non-http contexts :/
    // this.context.setRequest(getContextRequest(this.config.type, context));
    return next.handle().pipe(
      tap(() => {
        this.context.clear();
      }),
    );
  }
}
