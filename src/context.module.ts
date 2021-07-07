import {
  Global,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
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
import { addContextConfigDefaults, Context, ContextContainer } from './context';
import { SetResponseCorrelationIdMiddleware } from './middlewares/set-response-correlation-id.middleware';
import { CreateContextMiddleware } from './middlewares/create-context.middleware';
import { CurrentContext } from './context/current-context';
import { GenerateRequestIdMiddleware } from './middlewares/generate-request-id.middleware';

export const createContextModule = (
  config: ContextConfigType = {
    type: ContextName.HTTP,
    build: {},
  },
) => {
  const { providers = [], imports = [], addDefaults = true } = config;
  const configUseValue = addDefaults
    ? addContextConfigDefaults(config)
    : config;
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
        useValue: configUseValue,
      },
      ContextContainer,
      CurrentContext,
      {
        provide: Context,
        useExisting: CurrentContext,
      },
    ],
    imports,
    exports: [Context],
    global: true,
  };
};

@Global()
@Module({})
export class ContextModule implements NestModule {
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
    // register context
    const allRoutes: RouteInfo = {
      path: '*',
      method: RequestMethod.ALL,
    };
    consumer
      .apply(
        GenerateRequestIdMiddleware,
        CreateContextMiddleware,
        SetResponseCorrelationIdMiddleware,
      )
      .forRoutes(allRoutes);
    // add auto-generated correlation-id
    const routes = this.config?.correlation_id?.routes ?? allRoutes;
    consumer.apply(GenerateCorrelationIdMiddleware).forRoutes(routes);

    this.alreadyRegister = true;
  }
}
