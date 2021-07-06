import { Inject, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { ModuleRef } from '@nestjs/core';
import { get, invert, pick, pickBy, set } from 'lodash';
import { ContextConfigType, IContextPropertyProvider } from '../interfaces';
import { CONTEXT_MODULE_CONFIG } from '../constants';

@Injectable()
export class Context {
  private id: string;
  private readonly build: ContextConfigType['build'];
  private cache: Map<string | symbol, any>;
  public request: any = null;

  constructor(
    @Inject(CONTEXT_MODULE_CONFIG)
    private readonly config: ContextConfigType,
    private readonly moduleRef?: ModuleRef,
  ) {
    this.id = v4();
    this.build = config?.build || {};
    this.clear();
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

  clear() {
    this.cache = new Map<string | symbol, any>();
    this.setRequest(null);
    return this;
  }

  isCleared() {
    return this.request === null && this.cache.size === 0;
  }

  public setRequest(request: any) {
    this.request = request;
    return this;
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

  createView(mapping) {
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
