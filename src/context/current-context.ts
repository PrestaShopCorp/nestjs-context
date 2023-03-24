/* eslint-disable @typescript-eslint/no-unused-vars */
import { ContextContainer } from './context-container';
import { Injectable } from '@nestjs/common';
import { Context } from './context';

@Injectable()
export class CurrentContext {
  constructor(private readonly contexts: ContextContainer) {}

  private call(name: string, ...args: (string | boolean | symbol)[]): any {
    const currentContext = this.contexts.current();

    if (currentContext instanceof Promise) {
      return currentContext.then((context) => context[name](...args));
    }

    return this.contexts.current()[name](...args);
  }

  get(...args: Parameters<Context['get']>): any {
    return this.call('get', ...args);
  }

  getAll(...args: Parameters<Context['getAll']>): any {
    const context = this.call('getAll', ...args);

    return context;
  }

  createView(...args: Parameters<Context['createView']>): any {
    return this.call('createView', ...args);
  }

  getId(...args: Parameters<Context['getId']>): any {
    return this.call('getId', ...args);
  }

  setCachedValue(...args: Parameters<Context['setCachedValue']>): any {
    return this.call('setCachedValue', ...args);
  }

  getCachedValue(...args: Parameters<Context['getCachedValue']>): any {
    return this.call('getCachedValue', ...args);
  }
}
