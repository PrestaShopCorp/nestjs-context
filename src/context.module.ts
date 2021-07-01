import {
  Global,
  Inject,
  MiddlewareConsumer,
  Module,
  RequestMethod,
  Scope,
} from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { ContextConfigType, ContextName } from './interfaces';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  ClearContextRequestInterceptor,
  GenerateCorrelationIdMiddleware,
} from './interceptors';
import { CONTEXT_MODULE_CONFIG } from './constants';
import { addContextDefaults, Context } from './context';
import { SetResponseCorrelationIdMiddleware } from './middlewares/set-response-correlation-id.middleware';
import { SetContextRequestMiddleware } from './middlewares/set-context-request.middleware';

export const createContextModule = (
  config: ContextConfigType = {
    type: ContextName.HTTP,
    build: {},
  },
) => {
  const { providers = [], imports = [], addDefaults = true } = config;
  return {
    module: ContextModule,
    providers: [
      ...providers,
      {
        provide: APP_INTERCEPTOR,
        scope: Scope.REQUEST,
        useClass: ClearContextRequestInterceptor,
      },
      {
        provide: CONTEXT_MODULE_CONFIG,
        useValue: addDefaults ? addContextDefaults(config) : config,
      },
      Context,
    ],
    imports,
    exports: [Context],
    global: true,
  };
};

@Global()
@Module({})
export class ContextModule {
  private alreadyRegister = false;
  constructor(
    @Inject(CONTEXT_MODULE_CONFIG) private readonly config: ContextConfigType,
  ) {}
  /**
   * @deprecated
   */
  static registerWithDefaults(config?: ContextConfigType) {
    return createContextModule(config);
  }
  static register(config?: ContextConfigType) {
    return createContextModule(config);
  }
  configure(consumer: MiddlewareConsumer) {
    if (this.alreadyRegister) {
      return;
    }
    const allRoutes: RouteInfo = {
      path: '*',
      method: RequestMethod.ALL,
    };
    const routes = this.config?.correlation_id?.routes ?? allRoutes;
    consumer.apply(SetResponseCorrelationIdMiddleware).forRoutes(allRoutes);
    consumer.apply(GenerateCorrelationIdMiddleware).forRoutes(routes);
    consumer.apply(SetContextRequestMiddleware).forRoutes(allRoutes);
    this.alreadyRegister = true;
  }
}
