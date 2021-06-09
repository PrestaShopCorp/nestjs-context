import { Module, Scope } from '@nestjs/common';
import { ContextConfigType, ContextName } from './interfaces';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  ContextRequestInterceptor,
  CorrelationIdInterceptor,
} from './interceptors';
import { CONTEXT_MODULE_CONFIG } from './constants';
import { addContextDefaults, Context } from './context';

export const createContextModule = (
  config: ContextConfigType = {
    type: ContextName.HTTP,
    build: {},
  },
) => {
  const { global = false, addDefaults = true } = config;
  return {
    module: ContextModule,
    providers: [
      {
        provide: APP_INTERCEPTOR,
        scope: Scope.REQUEST,
        useClass: ContextRequestInterceptor,
      },
      {
        provide: APP_INTERCEPTOR,
        scope: Scope.REQUEST,
        useClass: CorrelationIdInterceptor,
      },
      {
        provide: CONTEXT_MODULE_CONFIG,
        useValue: addDefaults ? addContextDefaults(config) : config,
      },
      Context,
    ],
    exports: [Context],
    global,
  };
};

@Module({})
export class ContextModule {
  /**
   * @deprecated
   */
  static registerWithDefaults(config?: ContextConfigType) {
    return createContextModule(config);
  }
  static register(config?: ContextConfigType) {
    return createContextModule(config);
  }
}
