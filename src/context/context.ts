import { Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { get, pickBy, set } from 'lodash';
import { ConfigType, IContextPropertyProvider } from '../interfaces';

export class Context {
  private readonly build: ConfigType['build'];
  private cache: Map<string | symbol, any>;
  private readonly logger = new Logger();
  private request: any = null;

  constructor(
    private readonly config: ConfigType,
    private readonly moduleRef?: ModuleRef,
  ) {
    this.build = config?.build || {};
    this.logger.setContext(Context.name);
    this.clear();
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
    return this;
  }

  public setRequest(request: any) {
    this.request = request;
    return this;
  }

  private getRequest() {
    return this.request;
  }

  private getProvider(name): IContextPropertyProvider {
    try {
      return this.moduleRef?.get(name);
    } catch (e) {
      return undefined;
    }
  }

  private hasProvider(name): boolean {
    return this.config?.providers?.includes(name) ?? false;
  }

  private buildContextValue(key, definition) {
    // context set value
    if (!!this.config.cache && this.isCached(key)) {
      return this.getCachedValue(key);
    }

    // from request
    if (typeof definition === 'string' && definition.startsWith('req.')) {
      return get(this.getRequest(), definition.replace(/^req./, ''));
    }

    // from provider
    if (
      ['string', 'symbol', 'function'].includes(typeof definition) &&
      this.hasProvider(definition)
    ) {
      return this.getProvider(definition)?.get(this.getRequest(), key) || null;
    }

    // from callback
    if (typeof definition === 'function') {
      return definition(this.getRequest());
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
    if (!!this.config.cache) {
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
      set(context, key, this.get(key));
    }
    this.logger.debug(`Got context ${JSON.stringify(context)}`);
    return includeNull
      ? context
      : pickBy(context, (ctx) => ctx !== null && ctx !== undefined);
  }
}
