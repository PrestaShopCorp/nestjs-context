/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContextContainerExposer {
  private contexts;
  private cache;
  private config;

  getContexts() {
    return null;
  }

  getCache() {
    return null;
  }

  getConfig() {
    return null;
  }
}
