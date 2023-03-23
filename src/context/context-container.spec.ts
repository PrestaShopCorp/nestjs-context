import { INestApplication } from '@nestjs/common';
import { ContextContainer } from './context-container';
import {
  assertContext,
  assertMultipleContext,
  RequestType,
} from '../tests/utils/context.utils';
import { AsyncRequestServiceExposer } from '../tests/mocks/exposers/async-request-service-exposer.mock';
import { buildTestModule } from '../tests/test-module.builder';
import { buildHttpRequest } from '../tests/utils/http-request.utils';
import { buildGraphQLRequest } from '../tests/utils/graphql-request.utils';
import { TestService } from '../tests/mocks/module/test-service.mock';
import { buildEventRequest } from '../tests/utils/event-request.utils';
import { assertCache } from '../tests/utils/cache-utils';

describe('context-container tests', () => {
  let app: INestApplication;
  let contextContainer: any;
  let asyncRequestService: AsyncRequestServiceExposer;
  let testService: TestService;

  async function initApp(maxCache = 100) {
    app = await buildTestModule(maxCache);

    await app.init();

    contextContainer = app.get<ContextContainer>(
      ContextContainer,
    ) as unknown as {
      contexts: ContextContainer['contexts'];
      cache: ContextContainer['cache'];
      config: ContextContainer['config'];
    };
    asyncRequestService = app.get<AsyncRequestServiceExposer>(
      AsyncRequestServiceExposer,
    );
    testService = app.get<TestService>(TestService);
  }

  beforeEach(async () => {
    await initApp();
  });

  it('should add a context from an HTTP request and remove it after the request is done', async () => {
    const requests = await buildHttpRequest(app);

    assertContext(requests[1].response.body, requests[1].testValue, 1);
    expect(Object.keys(contextContainer.contexts).length).toEqual(0);
    expect(contextContainer.cache.size).toEqual(0);
  });

  it('should add 2 contexts from 2 distinct HTTP requests and remove them after the requests are done (chrono order)', async () => {
    const requests = await buildHttpRequest(app, 2);

    assertMultipleContext(2, requests, RequestType.HTTP);
    expect(Object.keys(contextContainer.contexts).length).toEqual(0);
    expect(contextContainer.cache.size).toEqual(0);
  });

  it('should add 2 contexts from 2 distinct HTTP requests and remove them after the requests are done (invert order)', async () => {
    const isPromise = true;
    const requests = await buildHttpRequest(app, 2, isPromise);

    // We want to resolve the second request first
    asyncRequestService.resolve[2]();

    const response2: any = await requests[2].response;

    assertContext(response2.body, requests[2].testValue, 2);
    expect(Object.keys(contextContainer.contexts).length).toEqual(1);
    expect(Object.keys(contextContainer.contexts)).not.toContainEqual(
      response2.body.clsId,
    );

    // And then we resolve the first one
    asyncRequestService.resolve[1]();

    const response1: any = await requests[1].response;

    assertContext(response1.body, requests[1].testValue, 1);
    expect(Object.keys(contextContainer.contexts).length).toEqual(0);
    expect(contextContainer.cache.size).toEqual(0);
  });

  it('should add 3 contexts from 3 distinct HTTP requests and remove them after the requests are done (chrono order)', async () => {
    const requests = await buildHttpRequest(app, 3);

    assertMultipleContext(3, requests, RequestType.HTTP);
    expect(Object.keys(contextContainer.contexts).length).toEqual(0);
    expect(contextContainer.cache.size).toEqual(0);
  });

  it('should add 3 contexts from 3 distinct HTTP requests and remove them after the requests are done (invert order)', async () => {
    const isPromise = true;
    const requests = await buildHttpRequest(app, 3, isPromise);

    // We want to resolve the third request first
    asyncRequestService.resolve[3]();

    const response3: any = await requests[3].response;

    assertContext(response3.body, requests[3].testValue, 3);
    expect(Object.keys(contextContainer.contexts).length).toEqual(2);
    expect(Object.keys(contextContainer.contexts)).not.toContainEqual(
      response3.body.clsId,
    );

    // Then we resolve the second request
    asyncRequestService.resolve[2]();

    const response2: any = await requests[2].response;

    assertContext(response2.body, requests[2].testValue, 2);
    expect(Object.keys(contextContainer.contexts).length).toEqual(1);
    expect(Object.keys(contextContainer.contexts)).not.toContainEqual(
      response2.body.clsId,
    );

    // And finally we resolve the first one
    asyncRequestService.resolve[1]();

    const response1: any = await requests[1].response;

    assertContext(response1.body, requests[1].testValue, 1);
    expect(Object.keys(contextContainer.contexts).length).toEqual(0);
    expect(contextContainer.cache.size).toEqual(0);
  });

  it('should add 3 contexts from 3 distinct HTTP requests and remove them after the requests are done (random order : 2-3-1)', async () => {
    const isPromise = true;
    const requests = await buildHttpRequest(app, 3, isPromise);

    // We want to resolve the second request first
    asyncRequestService.resolve[2]();

    const response2: any = await requests[2].response;

    assertContext(response2.body, requests[2].testValue, 2);
    expect(Object.keys(contextContainer.contexts).length).toEqual(2);
    expect(Object.keys(contextContainer.contexts)).not.toContainEqual(
      response2.body.clsId,
    );

    // Then we resolve the third request
    asyncRequestService.resolve[3]();

    const response3: any = await requests[3].response;

    assertContext(response3.body, requests[3].testValue, 2);
    expect(Object.keys(contextContainer.contexts).length).toEqual(1);
    expect(Object.keys(contextContainer.contexts)).not.toContainEqual(
      response3.body.clsId,
    );

    // And finally we resolve the first one
    asyncRequestService.resolve[1]();

    const response1: any = await requests[1].response;

    assertContext(response1.body, requests[1].testValue, 1);
    expect(Object.keys(contextContainer.contexts).length).toEqual(0);
    expect(contextContainer.cache.size).toEqual(0);
  });

  it('should add 50 contexts from 50 distinct HTTP requests and remove them after the requests are done (chrono order)', async () => {
    const requests = await buildHttpRequest(app, 50);

    assertMultipleContext(50, requests, RequestType.HTTP);
    expect(Object.keys(contextContainer.contexts).length).toEqual(0);
    expect(contextContainer.cache.size).toEqual(0);
  });

  it('should add a context from a GraphQL request and remove it after the request is done', async () => {
    const requests = await buildGraphQLRequest(app);

    assertContext(
      requests[1].response.data.testGQLQuery,
      requests[1].testValue,
      1,
    );
    expect(Object.keys(contextContainer.contexts).length).toEqual(0);
    expect(contextContainer.cache.size).toEqual(0);
  });

  it('should add 2 contexts from 2 distinct GraphQL requests and remove them after the requests are done (chrono order)', async () => {
    const requests = await buildGraphQLRequest(app, 2);

    assertMultipleContext(2, requests, RequestType.GRAPHQL);
    expect(Object.keys(contextContainer.contexts).length).toEqual(0);
    expect(contextContainer.cache.size).toEqual(0);
  });

  it('should add 2 contexts from 2 distinct GraphQL requests and remove them after the requests are done (invert order)', async () => {
    const isPromise = true;
    const requests = await buildGraphQLRequest(app, 2, isPromise);

    // We want to resolve the second request first
    asyncRequestService.resolve[2]();

    const response2: any = (await requests[2].response).data.testGQLQuery;

    assertContext(response2, requests[2].testValue, 2);
    expect(Object.keys(contextContainer.contexts).length).toEqual(1);
    expect(Object.keys(contextContainer.contexts)).not.toContainEqual(
      response2.clsId,
    );

    // And then we resolve the first one
    asyncRequestService.resolve[1]();

    const response1: any = (await requests[1].response).data.testGQLQuery;

    assertContext(response1, requests[1].testValue, 1);
    expect(Object.keys(contextContainer.contexts).length).toEqual(0);
    expect(contextContainer.cache.size).toEqual(0);
  });

  it('should add 3 contexts from 3 distinct GraphQL requests and remove them after the requests are done (chrono order)', async () => {
    const requests = await buildGraphQLRequest(app, 3);

    assertMultipleContext(3, requests, RequestType.GRAPHQL);
    expect(Object.keys(contextContainer.contexts).length).toEqual(0);
    expect(contextContainer.cache.size).toEqual(0);
  });

  it('should add 3 contexts from 3 distinct GraphQL requests and remove them after the requests are done (invert order)', async () => {
    const isPromise = true;
    const requests = await buildGraphQLRequest(app, 3, isPromise);

    // We want to resolve the third request first
    asyncRequestService.resolve[3]();

    const response3: any = (await requests[3].response).data.testGQLQuery;

    assertContext(response3, requests[3].testValue, 3);
    expect(Object.keys(contextContainer.contexts).length).toEqual(2);
    expect(Object.keys(contextContainer.contexts)).not.toContainEqual(
      response3.clsId,
    );

    // Then we resolve the second request
    asyncRequestService.resolve[2]();

    const response2: any = (await requests[2].response).data.testGQLQuery;

    assertContext(response2, requests[2].testValue, 2);
    expect(Object.keys(contextContainer.contexts).length).toEqual(1);
    expect(Object.keys(contextContainer.contexts)).not.toContainEqual(
      response2.clsId,
    );

    // And finally we resolve the first one
    asyncRequestService.resolve[1]();

    const response1: any = (await requests[1].response).data.testGQLQuery;

    assertContext(response1, requests[1].testValue, 1);
    expect(Object.keys(contextContainer.contexts).length).toEqual(0);
    expect(contextContainer.cache.size).toEqual(0);
  });

  it('should add 3 contexts from 3 distinct GraphQL requests and remove them after the requests are done (random order : 2-3-1)', async () => {
    const isPromise = true;
    const requests = await buildGraphQLRequest(app, 3, isPromise);

    // We want to resolve the second request first
    asyncRequestService.resolve[2]();

    const response2: any = (await requests[2].response).data.testGQLQuery;

    assertContext(response2, requests[2].testValue, 2);
    expect(Object.keys(contextContainer.contexts).length).toEqual(2);
    expect(Object.keys(contextContainer.contexts)).not.toContainEqual(
      response2.clsId,
    );

    // Then we resolve the third request
    asyncRequestService.resolve[3]();

    const response3: any = (await requests[3].response).data.testGQLQuery;

    assertContext(response3, requests[3].testValue, 2);
    expect(Object.keys(contextContainer.contexts).length).toEqual(1);
    expect(Object.keys(contextContainer.contexts)).not.toContainEqual(
      response3.clsId,
    );

    // And finally we resolve the first one
    asyncRequestService.resolve[1]();

    const response1: any = (await requests[1].response).data.testGQLQuery;

    assertContext(response1, requests[1].testValue, 1);
    expect(Object.keys(contextContainer.contexts).length).toEqual(0);
    expect(contextContainer.cache.size).toEqual(0);
  });

  it('should add 50 contexts from 50 distinct GraphQL requests and remove them after the requests are done (chrono order)', async () => {
    const requests = await buildGraphQLRequest(app, 50);

    assertMultipleContext(50, requests, RequestType.GRAPHQL);
    expect(Object.keys(contextContainer.contexts).length).toEqual(0);
    expect(contextContainer.cache.size).toEqual(0);
  });

  it('should add a context from an "event request" and keep it in the cache after the requests are done', async () => {
    const requests = await buildEventRequest(testService);

    assertContext(requests[1].response, requests[1].testValue, 1);
    assertCache(contextContainer.cache, 1, requests);
    expect(Object.keys(contextContainer.contexts).length).toEqual(0);
  });

  it('should add 2 contexts from 2 distinct "event requests" and keep them int the cache after the requests are done (chrono order)', async () => {
    const requests = await buildEventRequest(testService, 2);

    assertMultipleContext(2, requests, RequestType.EVENT);
    assertCache(contextContainer.cache, 2, requests);
    expect(Object.keys(contextContainer.contexts).length).toEqual(0);
  });

  it('should add 2 contexts from 2 distinct "event requests" and keep them in the cache after the requests are done (invert order)', async () => {
    const isPromise = true;
    const requests = await buildEventRequest(testService, 2, isPromise);

    // We want to resolve the second request first
    asyncRequestService.resolve[2]();

    const response2 = await requests[2].response;

    assertContext(response2, requests[2].testValue, 1);

    // And then we resolve the first one
    asyncRequestService.resolve[1]();

    const response1 = await requests[1].response;

    assertContext(response1, requests[1].testValue, 1);
    assertCache(contextContainer.cache, 2, requests);
    expect(Object.keys(await contextContainer.contexts).length).toEqual(0);
  });

  it('should add 3 contexts from 3 distinct "event requests" and keep them in the cache after the requests are done (chrono order)', async () => {
    const requests = await buildEventRequest(testService, 3);

    assertMultipleContext(3, requests, RequestType.EVENT);
    assertCache(contextContainer.cache, 3, requests);
    expect(Object.keys(contextContainer.contexts).length).toEqual(0);
  });

  it('should add 3 contexts from 3 distinct "event requests" and remove them after the requests are done (invert order)', async () => {
    const isPromise = true;
    const requests = await buildEventRequest(testService, 3, isPromise);

    // We want to resolve the third request first
    asyncRequestService.resolve[3]();

    const response3 = await requests[3].response;

    assertContext(response3, requests[3].testValue, 1);

    // Then we resolve the second request
    asyncRequestService.resolve[2]();

    const response2 = await requests[2].response;

    assertContext(response2, requests[2].testValue, 1);

    // And finally we resolve the first one
    asyncRequestService.resolve[1]();

    const response1 = await requests[1].response;

    assertContext(response1, requests[1].testValue, 1);
    assertCache(contextContainer.cache, 3, requests);
    expect(Object.keys(await contextContainer.contexts).length).toEqual(0);
  });

  it('should add 3 contexts from 3 distinct "event requests" and keep them in the cache after the requests are done (random order : 2-3-1)', async () => {
    const isPromise = true;
    const requests = await buildEventRequest(testService, 3, isPromise);

    // We want to resolve the second request first
    asyncRequestService.resolve[2]();

    const response2 = await requests[2].response;

    assertContext(response2, requests[2].testValue, 1);

    // Then we resolve the third request
    asyncRequestService.resolve[3]();

    const response3 = await requests[3].response;

    assertContext(response3, requests[3].testValue, 1);

    // And finally we resolve the first one
    asyncRequestService.resolve[1]();

    const response1: any = await requests[1].response;

    assertContext(response1, requests[1].testValue, 1);
    assertCache(contextContainer.cache, 3, requests);
    expect(Object.keys(await contextContainer.contexts).length).toEqual(0);
  });

  it('should add 50 contexts from 50 distinct "event requests" and keep them in the cache after the requests are done (chrono order)', async () => {
    const requests = await buildEventRequest(testService, 50);

    assertMultipleContext(50, requests, RequestType.EVENT);
    assertCache(contextContainer.cache, 50, requests);
    expect(Object.keys(contextContainer.contexts).length).toEqual(0);
  });

  it('should add 200 contexts from 200 distinct "event requests" and the cache size should not be greater than 100', async () => {
    const requests = await buildEventRequest(testService, 200);

    assertMultipleContext(200, requests, RequestType.EVENT);
    assertCache(contextContainer.cache, 100, requests);
    expect(contextContainer.cache.size).toEqual(100);
    expect(Object.keys(contextContainer.contexts).length).toEqual(0);
  });

  it('should add 50 contexts from 50 distinct HTTP requests and 50 contexts from 50 distinct "event requests", the cache size should be 50 and the contexts stack should be empty', async () => {
    const httpRequests = await buildHttpRequest(app, 50);
    const eventRequests = await buildEventRequest(testService, 50);

    assertMultipleContext(50, httpRequests, RequestType.HTTP);
    assertMultipleContext(50, eventRequests, RequestType.EVENT);
    assertCache(contextContainer.cache, 50, eventRequests);
    expect(contextContainer.cache.size).toEqual(50);
    expect(Object.keys(contextContainer.contexts).length).toEqual(0);
  });

  it('should limit the cache size to the passed parameter', async () => {
    await initApp(10);

    const eventRequests = await buildEventRequest(testService, 50);

    assertMultipleContext(50, eventRequests, RequestType.EVENT);
    assertCache(contextContainer.cache, 10, eventRequests);
    expect(contextContainer.cache.size).toEqual(10);
    expect(Object.keys(contextContainer.contexts).length).toEqual(0);
  });

  afterEach(async () => {
    await app.close();
  });
});
