import { Injectable } from '@nestjs/common';
import { NestMiddleware } from '@nestjs/common';
import { ContextContainer } from '../context/context-container';

@Injectable()
export class CreateContextMiddleware implements NestMiddleware {
  constructor(private readonly contexts: ContextContainer) {}
  use(req: any, res: any, next: () => void) {
    this.contexts.add(req);
    res.on('finish', () => {
      this.contexts.remove();
    });
    next();
  }
}
