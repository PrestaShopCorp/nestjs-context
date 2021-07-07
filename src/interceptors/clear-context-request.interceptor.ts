import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ContextContainer } from '../context';

@Injectable()
export class ClearContextRequestInterceptor implements NestInterceptor {
  constructor(private readonly contexts: ContextContainer) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      finalize(() => {
        this.contexts.remove(context.switchToHttp().getRequest());
      }),
    );
  }
}
