import { ContextContainer } from './context-container';
import { Injectable } from '@nestjs/common';
import { Context } from './context';

@Injectable()
export class CurrentContext {
  constructor(private readonly contexts: ContextContainer) {}
  private call(name, ...args) {
    return this.contexts.current()[name](...args);
  }
  get(...args: Parameters<Context['get']>) {
    return this.call('get', ...args);
  }
  getAll(...args: Parameters<Context['getAll']>) {
    return this.call('getAll', ...args);
  }
  createView(...args: Parameters<Context['createView']>) {
    return this.call('createView', ...args);
  }
  getId(...args: Parameters<Context['getId']>) {
    return this.call('getId', ...args);
  }
  setCachedValue(...args: Parameters<Context['setCachedValue']>) {
    return this.call('setCachedValue', ...args);
  }
  getCachedValue(...args: Parameters<Context['getCachedValue']>) {
    return this.call('getCachedValue', ...args);
  }
}
