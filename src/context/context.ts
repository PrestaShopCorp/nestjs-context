import { Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { get, pickBy, set } from 'lodash';
import { ConfigType, IContextPropertyProvider } from '../interfaces';
import {
  isGqlContextRequestDefinition,
  isHttpContextRequestDefinition,
} from '../type-guards';

export class Context {
  private readonly logger = new Logger();
  constructor(
    private readonly build: ConfigType['build'],
    private readonly request?: any,
    private readonly moduleRef?: ModuleRef,
  ) {
    this.logger.setContext(Context.name);
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

  private buildContextValue(key, definition) {
    if (
      isHttpContextRequestDefinition(definition) ||
      isGqlContextRequestDefinition(definition)
      // TODO do we need to add a microservice definition too ?
    ) {
      return this.getRequest() ? get(this.getRequest(), definition) : null;
    }

    // from provider
    const provider = ['string', 'symbol', 'function'].includes(
      typeof definition,
    )
      ? this.getProvider(definition)
      : null;
    if (!!provider && !!provider.get) {
      return provider.get(this.getRequest(), key);
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
    return value;
  }

  getAll(includeNull = false) {
    const context: any = {};
    for (const key of Object.keys(this.build)) {
      set(context, key, this.get(key));
    }
    this.logger.debug(`Got context ${JSON.stringify(context)}`);
    return includeNull
      ? context
      : pickBy(context, (ctx) => ctx !== null && ctx !== undefined);
  }
}
