import { Module, Scope } from '@nestjs/common';
import { APP_INTERCEPTOR, ModuleRef } from '@nestjs/core';
import { addContextDefaults, Context } from './context';
import { ConfigType, ContextName } from './interfaces';
import { CONTEXT_MODULE_CONFIG } from './constants';
import {
  CorrelationIdInterceptor,
  ContextRequestInterceptor,
} from './interceptors';

@Module({})
export class ContextModule {
  static registerWithDefaults(
    config: ConfigType = { type: ContextName.HTTP, build: {} },
  ) {
    return ContextModule.register(config, true);
  }
  static register(config: ConfigType, addDefaults = false) {
    const { providers = [] } = config;
    return {
      module: ContextModule,
      providers: [
        ...providers,
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
        {
          provide: Context,
          useFactory: (config: ConfigType, moduleRef: ModuleRef) =>
            new Context(config, moduleRef),
          inject: [CONTEXT_MODULE_CONFIG, ModuleRef],
        },
      ],
      exports: [Context],
    };
  }
}
