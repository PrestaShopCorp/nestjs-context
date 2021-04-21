import { Module, Scope } from '@nestjs/common';
import { APP_INTERCEPTOR, ModuleRef, REQUEST } from '@nestjs/core';
import { CONTEXT } from '@nestjs/graphql';
import { addContextDefaults, Context } from './context';
import { ConfigType, ContextName } from './interfaces';
import { CONTEXT_MODULE_CONFIG } from './constants';
import { CorrelationIdInterceptor } from './interceptors';

@Module({})
export class ContextModule {
  static registerWithDefaults(config: ConfigType) {
    return ContextModule.register(config, true);
  }
  static register(config: ConfigType, addDefaults = false) {
    const { type, providers } = config;
    const requestProviders = {
      [ContextName.HTTP]: REQUEST,
      [ContextName.GQL]: CONTEXT,
    };
    return {
      module: ContextModule,
      providers: [
        ...providers,
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
          scope: Scope.REQUEST,
          useFactory: (
            config: ConfigType,
            moduleRef: ModuleRef,
            request = undefined,
          ) => new Context(config, request, moduleRef),
          inject: [
            CONTEXT_MODULE_CONFIG,
            ModuleRef,
            requestProviders[type],
          ].filter((x) => !!x),
        },
      ],
      exports: [Context],
    };
  }
}
