import { ModuleRef } from '@nestjs/core';
import { get, pickBy, set } from 'lodash';
import { ConfigType, IContextPropertyProvider } from './interfaces';
import {
  isGqlContextRequestDefinition,
  isHttpContextRequestDefinition,
} from './type-guards';

export class Context {
  constructor(
    private readonly config: ConfigType,
    private readonly request?: any,
    private readonly moduleRef?: ModuleRef,
  ) {}

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
    // from request
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
    for (const definition of this.config.build[key]) {
      value = this.buildContextValue(key, definition) ?? value;
    }
    return value;
  }

  getAll(includeNull = false) {
    const context: any = {};
    for (const key in this.config.build) {
      set(context, key, this.get(key));
    }
    return includeNull
      ? context
      : pickBy(context, (ctx) => ctx !== null && ctx !== undefined);
  }
}
