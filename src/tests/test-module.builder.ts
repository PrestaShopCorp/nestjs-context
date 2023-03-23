import { INestApplication, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ContextContainer } from '../context';
import { AsyncRequestServiceExposer } from './mocks/exposers/async-request-service-exposer.mock';
import { ContextContainerExposer } from './mocks/exposers/context-container-exposer.mock';
import { TestModule } from './mocks/module/test-module.mock';

export async function buildTestModule(maxCache = 100) {
  // eslint-disable-next-line prefer-const
  let app: INestApplication;

  class ContextContainerServiceMock {
    private contextContainer: Record<string, any>;

    initContextContainer() {
      if (!this.contextContainer) {
        this.contextContainer = app.get<ContextContainer>(
          ContextContainer,
        ) as unknown as {
          contexts: ContextContainer['contexts'];
          cache: ContextContainer['cache'];
          config: ContextContainer['config'];
        };
      }
    }

    getContexts() {
      this.initContextContainer();

      return this.contextContainer.contexts;
    }

    getCache() {
      this.initContextContainer();

      return this.contextContainer.cache;
    }

    getConfig() {
      this.initContextContainer();

      return this.contextContainer.config;
    }
  }

  class AsyncRequestServiceMock {
    private promise = {};
    public resolve = {};

    constructor() {
      for (let i = 0; i < 10; i++) {
        this.promise[i.toString()] = new Promise((resolve) => {
          this.resolve[i.toString()] = resolve;
        });
      }
    }

    getResponse(awaitId: string) {
      return this.promise[awaitId];
    }
  }

  const moduleRef = await Test.createTestingModule({
    imports: [TestModule.forRoot(maxCache)],
  })
    .overrideProvider(ContextContainerExposer)
    .useClass(ContextContainerServiceMock)
    .overrideProvider(AsyncRequestServiceExposer)
    .useClass(AsyncRequestServiceMock)
    .setLogger(new Logger())
    .compile();
  app = moduleRef.createNestApplication();

  return app;
}
