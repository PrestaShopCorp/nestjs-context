import { ModuleRef } from '@nestjs/core';
import { get, invert, pick, pickBy, set } from 'lodash';
import {
  ContextConfigType,
  IContextPropertyProvider,
  RequestType,
} from '../interfaces';

export class Context {
  private readonly cache: Map<string | symbol, any> = new Map();
  private readonly build: ContextConfigType['build'];

  constructor(
    private readonly id: number | string,
    private readonly config: ContextConfigType,
    public readonly request: RequestType,
    private readonly moduleRef?: ModuleRef,
  ) {
    this.build = config?.build || {};
  }

  getId() {
    return this.id;
  }

  setCachedValue(key: string | symbol, value: any) {
    this.cache[key] = value;
    return this;
  }

  getCachedValue(key: string | symbol) {
    return this.cache[key] ?? null;
  }

  isCached(key: string | symbol): boolean {
    return typeof this.cache[key] !== 'undefined';
  }

  private getProvider(name): IContextPropertyProvider {
    try {
      return this.moduleRef?.get(name);
    } catch (e) {
      return undefined;
    }
  }

  private buildContextValue(key, definition) {
    // context set value
    if (this.isCached(key)) {
      return this.getCachedValue(key);
    }

    // from request
    if (typeof definition === 'string' && definition.startsWith('req.')) {
      return get(this.request, definition.replace(/^req./, ''));
    }

    // from provider
    if (['string', 'symbol', 'function'].includes(typeof definition)) {
      const provider = this.getProvider(definition);
      if (!!provider) {
        return provider.get(this.request, key) || null;
      }
    }

    // from callback
    if (typeof definition === 'function') {
      try {
        return definition(this.request);
      } catch (e) {
        return null;
      }
    }

    // from custom number or custom string value
    if (['number', 'string'].includes(typeof definition)) {
      return definition;
    }

    return null;
  }

  get(key) {
    let value = null;
    for (const definition of this.build[key]) {
      // console.log('test nestjs-context');
      value = this.buildContextValue(key, definition) ?? value;
    }
    if (!!this.config.cached) {
      this.setCachedValue(key, value);
    }
    return value;
  }

  getAll(includeNull = false) {
    const context: any = {};
    if (!this.build) {
      return context;
    }
    for (const key of Object.keys(this.build)) {
      // TODO this only works with \\. OR ., but not for both
      if (key.includes('\\.')) {
        context[key.replace(/\\./g, '.')] = this.get(key);
      } else {
        set(context, key, this.get(key));
      }
    }
    return includeNull
      ? context
      : pickBy(context, (ctx) => ctx !== null && ctx !== undefined);
  }

  createView(mapping: any) {
    const labelsMapping = invert(mapping);
    const toPick = Object.keys(labelsMapping);
    const subContext = pick(this.getAll(), toPick);
    const view: Record<string, any> = {};
    toPick.forEach((ctxProperty) => {
      view[labelsMapping[ctxProperty]] = get(subContext, ctxProperty);
    });
    return view;
  }
}
