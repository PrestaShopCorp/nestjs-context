import { Module } from '@nestjs/common';
import { Context } from './context';
import { ConfigType, ProviderInterface } from './interfaces';
import { CONTEXT_MODULE_CONFIG } from './constants';
import { addContextDefaults } from './tools/add-context-defaults';
import { Provider } from '@nestjs/common';

@Module({})
export class ContextModule {
  static registerWithDefaults(
    type: ConfigType['type'],
    build: ConfigType['build'] = {},
    providers?: Provider<ProviderInterface>[],
  ) {
    return ContextModule.register(type, build, providers, true);
  }
  static register(
    type: ConfigType['type'],
    build: ConfigType['build'],
    providers: Provider<ProviderInterface>[] = [],
    addDefaults = false,
  ) {
    const config = { type, build };
    return {
      module: ContextModule,
      providers: [
        ...providers,
        {
          provide: CONTEXT_MODULE_CONFIG,
          useValue: addDefaults ? addContextDefaults(config) : config,
        },
        Context,
      ],
      exports: [Context],
    };
  }
}
