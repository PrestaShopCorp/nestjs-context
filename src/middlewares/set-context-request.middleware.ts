import { Inject, Injectable } from '@nestjs/common';
import { NestMiddleware } from '@nestjs/common';
import { CONTEXT_MODULE_CONFIG } from '../constants';
import { ContextConfigType } from '../interfaces';
import { Context } from '../context';

@Injectable()
export class SetContextRequestMiddleware implements NestMiddleware {
  constructor(
    private readonly context: Context,
    @Inject(CONTEXT_MODULE_CONFIG) private readonly config: ContextConfigType,
  ) {}
  use(req: any, res: any, next: () => void) {
    if (this.context.isCleared()) {
      this.context.setRequest(req);
    }
    next();
  }
}
