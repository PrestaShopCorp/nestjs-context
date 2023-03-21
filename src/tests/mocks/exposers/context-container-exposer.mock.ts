/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContextContainerExposer {
  private contexts;

  getContexts() {
    return null;
  }

  current() {
    return null;
  }
}
