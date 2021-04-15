import { ModuleRef, REQUEST } from '@nestjs/core';
import { Inject, Injectable, Scope } from '@nestjs/common';
// import { CONTEXT } from '@nestjs/graphql';
import { get, pickBy } from 'lodash';
import { ConfigType, ProviderInterface } from './interfaces';
import {
  isGqlRequestContextDefinition,
  isHttpRequestContextDefinition,
} from './type-guards';
import { CONTEXT_MODULE_CONFIG } from './constants';

/**
 * @todo Add graphql and microservice contexts
 */
@Injectable({ scope: Scope.REQUEST })
export class Context {
  constructor(
    protected readonly moduleRef: ModuleRef,
    @Inject(CONTEXT_MODULE_CONFIG) protected readonly config: ConfigType,
    @Inject(REQUEST) private readonly request, // @Inject(CONTEXT) private readonly context,
  ) {}

  private getRequest() {
    return this.request;
    // return this.request ?? this.context;
  }

  private getProvider(name): ProviderInterface {
    try {
      return this.moduleRef.get(name);
    } catch (e) {
      return undefined;
    }
  }

  private buildContextValue(definition) {
    switch (true) {
      // from request
      case isHttpRequestContextDefinition(definition):
      case isGqlRequestContextDefinition(definition):
        return this.getRequest() ? get(this.getRequest(), definition) : null;
      // from provider or custom callback
      case typeof definition === 'function':
        const provider = this.getProvider(definition);
        return provider
          ? provider.get(this.getRequest())
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
      value = this.buildContextValue(definition) ?? value;
    });
    return value;
  }

  getAll(includeNull = false) {
    const context: any = {};
    Object.keys(this.config.build).forEach((key) => {
      context[key] = this.get(key);
    });
    return includeNull
      ? context
      : pickBy(context, (ctx) => ctx !== null && ctx !== undefined);
  }
}
