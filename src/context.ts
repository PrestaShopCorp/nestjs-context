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
    switch (true) {
      // from request
      case isHttpContextRequestDefinition(definition):
      case isGqlContextRequestDefinition(definition):
        // TODO do we need to add a microservice definition too ?
        return this.getRequest() ? get(this.getRequest(), definition) : null;

      // from provider or custom callback
      case typeof definition === 'function':
        const provider = this.getProvider(definition);
        return provider
          ? provider.get(this.getRequest(), key)
          : definition(this.getRequest());

      // from custom number or custom string value
      case ['number', 'string'].includes(typeof definition):
        return definition;

      // unknown
      default:
        return null;
    }
  }

  get(key) {
    let value = null;
    this.config.build[key]?.forEach((definition) => {
      value = this.buildContextValue(key, definition) ?? value;
    });
    return value;
  }

  getAll(includeNull = false) {
    const context: any = {};
    Object.keys(this.config.build).forEach((key) => {
      set(context, key, this.get(key));
    });
    return includeNull
      ? context
      : pickBy(context, (ctx) => ctx !== null && ctx !== undefined);
  }
}
