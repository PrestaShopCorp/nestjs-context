import { Injectable } from '@nestjs/common';
import { NestMiddleware } from '@nestjs/common';
import { ContextContainer } from '../context/context-container';

@Injectable()
export class CreateContextMiddleware implements NestMiddleware {

  constructor(private readonly contextContainer: ContextContainer) {}

  use(request: any, response: any, next: () => void) {
    this.contextContainer.createAndAddContextFromRequest(request);

    response.on('finish', () => {
      this.contextContainer.removeContextFromRequest(request);
    });

    next();
  }
}
