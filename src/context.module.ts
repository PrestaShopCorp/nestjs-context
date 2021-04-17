import { Module, Provider, Scope } from '@nestjs/common';
import { ModuleRef, REQUEST } from '@nestjs/core';
import { CONTEXT } from '@nestjs/graphql';
import { Context } from './context';
import {
  ConfigType,
  ContextName,
  IContextPropertyProvider,
} from './interfaces';
import { CONTEXT_MODULE_CONFIG } from './constants';
import { addContextDefaults } from './tools';

@Module({})
export class ContextModule {
  static registerWithDefaults(
    type: ConfigType['type'],
    build: ConfigType['build'] = {},
    contextPropertyProviders?: Provider<IContextPropertyProvider>[],
  ) {
    return ContextModule.register(type, build, contextPropertyProviders, true);
  }
  static register(
    type: ConfigType['type'],
    build: ConfigType['build'],
    contextPropertyProviders: Provider<IContextPropertyProvider>[] = [],
    addDefaults = false,
  ) {
    const config = { type, build };
    const requestProviders = {
      [ContextName.HTTP]: REQUEST,
      [ContextName.GQL]: CONTEXT,
    };

    return {
      module: ContextModule,
      providers: [
        ...contextPropertyProviders,
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
