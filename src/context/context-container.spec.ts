import {
  ConsoleLogger,
  Controller,
  Get,
  INestApplication,
  Inject,
  Injectable,
  Module,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ClsMiddleware,
  ClsModule,
  ClsModuleOptions,
  ClsService,
  InjectableProxy,
} from 'nestjs-cls';
import { ContextModule } from '../context.module';
import { HEADER_REQUEST_ID } from '../constants';
import { ContextConfigType, RequestType } from '../interfaces';
import { ContextName } from '../interfaces/context-name.enum';
import { ContextContainer } from './context-container';

const FACTORY_PROVIDER = 'FACTORY_PROVIDER';

@Injectable()
class InjectedClass {
  property = 'injected prop';
}

@Module({
  providers: [InjectedClass],
  exports: [InjectedClass],
})
class ImportedModule {}

@InjectableProxy()
class RequestScopedClass {
  id: string;
  requestScopedValue: string;

  constructor(
    private readonly cls: ClsService,
    private readonly injected: InjectedClass,
  ) {
    this.id = this.cls.getId();
  }

  getProperty() {
    return this.injected.property;
  }
}

function requestScopedFactory(injected: InjectedClass, cls: ClsService) {
  return {
    id: cls.getId(),
    getInjected: () => injected.property,
  };
}

async function getTestApp(forRootOptions: ClsModuleOptions) {
  @Module({
    imports: [
      ClsModule.forRoot({
        global: true,
        middleware: {
          mount: true,
          generateId: true,
        },
      }),
      ClsModule.forFeatureAsync({
        imports: [ImportedModule],
        useClass: RequestScopedClass,
      }),
      ClsModule.forFeatureAsync({
        provide: FACTORY_PROVIDER,
        imports: [ImportedModule],
        inject: [InjectedClass, ClsService],
        useFactory: requestScopedFactory,
      }),
    ],
    controllers: [],
    // controllers: [TestController],
  })
  class TestModule {}

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [TestModule],
    // imports: [ContextModule],
  })
    .setLogger(new ConsoleLogger())
    .compile();
  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
}

describe('context-container tests', () => {
  let app: INestApplication;
  let cls: ClsService;
  let config: ContextConfigType;
  let request: RequestType;
  let request2: RequestType;
  let request3: RequestType;

  beforeEach(async () => {
    app = await getTestApp({
      middleware: { mount: true, generateId: true },
    });
    config = {
      type: ContextName.HTTP,
      build: {},
    };
    request = {
      headers: {
        [HEADER_REQUEST_ID]: 'request_id_1',
      },
      [HEADER_REQUEST_ID]: 'unwanted_request_id_1',
    };
    request2 = {
      headers: {
        [HEADER_REQUEST_ID]: 'request_id_2',
      },
      [HEADER_REQUEST_ID]: 'unwanted_request_id_2',
    };
    request3 = {
      headers: {
        [HEADER_REQUEST_ID]: 'request_id_3',
      },
      [HEADER_REQUEST_ID]: 'unwanted_request_id_3',
    };
  });

  it('should add a context from a request', async () => {
    app.use(
      new ClsMiddleware({
        generateId: true,
        /* useEnterWith: true */
      }).use,
    );
    const cls = app.get<ClsService>(ClsService);
    console.log(app);
    console.log('id : ', cls.getId());
    const container = new ContextContainer(config, cls);
    const context = container.add(request);

    expect(container.get(request)).not.toBeNull();
    expect(context.getId()).toEqual('request_id_1');
    expect(container.current().getId()).toEqual('request_id_1');
  });

  it('should add and remove a context from a request', () => {
    const container = new ContextContainer(config, cls);
    const context = container.add(request);
    container.remove(request);

    expect(container.get(request)).toBeNull();
    expect(context.getId()).toEqual('request_id_1');
    expect(container.current().getId()).not.toEqual('request_id_1');
  });

  it('should add 2 contexts from 2 distinct requests', () => {
    const container = new ContextContainer(config, cls);
    const context1 = container.add(request);
    const context2 = container.add(request2);

    expect(container.get(request)).not.toBeNull();
    expect(context1.getId()).toEqual('request_id_1');
    expect(container.get(request2)).not.toBeNull();
    expect(context2.getId()).toEqual('request_id_2');
  });

  it('should add 2 contexts and remove them (chrono order) without errors', () => {
    const container = new ContextContainer(config, cls);
    const context1 = container.add(request);
    const context2 = container.add(request2);

    expect(context1.getId()).toEqual('request_id_1');
    expect(context2.getId()).toEqual('request_id_2');

    container.remove(request);

    expect(container.get(request)).toBeNull();
    expect(container.get(request2)).not.toBeNull();
    expect(container.current().getId()).toEqual('request_id_2');

    container.remove(request2);

    expect(container.get(request2)).toBeNull();
    expect(container.current().getId()).not.toEqual('request_id_2');
  });

  it('should add 2 contexts and remove them (invert order)', () => {
    const container = new ContextContainer(config, cls);
    const context1 = container.add(request);
    const context2 = container.add(request2);

    expect(context1.getId()).toEqual('request_id_1');
    expect(context2.getId()).toEqual('request_id_2');

    container.remove(request2);

    expect(container.get(request)).not.toBeNull();
    expect(container.get(request2)).toBeNull();
    expect(container.current().getId()).toEqual('request_id_1');

    container.remove(request);

    expect(container.get(request)).toBeNull();
    expect(container.current().getId()).not.toEqual('request_id_1');
  });

  it('should add 3 contexts, remove first one and deal with second one (current)', () => {
    const container = new ContextContainer(config, cls);
    const context1 = container.add(request);
    const context2 = container.add(request2);
    const context3 = container.add(request3);

    expect(context1.getId()).toEqual('request_id_1');
    expect(context2.getId()).toEqual('request_id_2');
    expect(context3.getId()).toEqual('request_id_3');

    container.remove(request);

    expect(container.get(request)).toBeNull();
    expect(container.get(request2)).not.toBeNull();
    expect(container.current().getId()).toEqual('request_id_2');

    container.remove(request2);

    expect(container.get(request2)).toBeNull();
    expect(container.current().getId()).toEqual('request_id_3');
  });
});
