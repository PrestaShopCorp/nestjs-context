import {
  Global,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { ContextConfigType, ContextName } from './interfaces';
import {
  CreateContextMiddleware,
  GenerateCorrelationIdMiddleware,
  GenerateRequestIdMiddleware,
  SetResponseCorrelationIdMiddleware,
} from './middlewares';
import { CONTEXT_MODULE_CONFIG } from './constants';
import { addContextConfigDefaults, Context, ContextContainer } from './context';

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
        provide: CONTEXT_MODULE_CONFIG,
        useValue: configUseValue,
      },
      ContextContainer,
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
