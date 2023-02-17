import { Injectable } from '@nestjs/common';
import { NestMiddleware } from '@nestjs/common';
import { HEADER_REQUEST_ID } from '../constants';
import { generateId } from '../tools';

@Injectable()
export class GenerateRequestIdMiddleware implements NestMiddleware {

  use(req: any, res: any, next: () => void) {
    req.headers[HEADER_REQUEST_ID] = generateId();
    next();
  }
}
