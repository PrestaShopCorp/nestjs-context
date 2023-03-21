/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { NestMiddleware } from '@nestjs/common';
import { UseCls } from 'nestjs-cls';
import { UseClsTeardown } from 'src/decorators/use-cls-teardown.decorator';
import { ContextContainer } from '../context/context-container';

@Injectable()
export class CreateContextMiddleware implements NestMiddleware {
  constructor(private readonly contexts: ContextContainer) {}

  use(req: any, res: any, next: () => void): void {
    this.contexts.add(req);

    res.on('finish', () => {
      this.contexts.remove();
    });

    next();
  }
}
