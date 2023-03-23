import { ContextResponseInterface } from '../interfaces/context-response.interface';
import { ContextInterface } from '../interfaces/context.interface';

export enum RequestType {
  HTTP = 'http',
  GRAPHQL = 'graphql',
  EVENT = 'event',
}

export type ContextType = ContextInterface & { testValue: string };
export type ContextResponse = { context: ContextType } & Pick<
  ContextResponseInterface,
  'clsId' | 'contexts'
>;

export function assertContext(
  response: ContextResponse,
  contextTestValue: string,
  contextStackLength: number,
): void {
  const { context, clsId, contexts } = response;

  expect(context).not.toBeNull();
  expect(context.id).toEqual(clsId);
  expect(context.testValue).toEqual(contextTestValue);
  expect(context.request_id).not.toBeNull();
  expect(context.correlation_id).not.toBeNull();
  expect(context.platform).not.toBeNull();
  expect(context.hostname).not.toBeNull();
  expect(context.bin).not.toBeNull();
  expect(context.path).not.toBeNull();
  expect(context.protocol).not.toBeNull();

  if (contexts) {
    expect(contexts).not.toBeNull();
    expect(contexts).toHaveLength(contextStackLength);
    expect(contexts).toContainEqual(clsId);
  }
}

export function assertMultipleContext(
  nb: number,
  requests: Record<string, any>,
  requestType: RequestType,
): void {
  for (let i = 1; i <= nb; i++) {
    let response;

    if (requestType === RequestType.HTTP) {
      response = requests[i].response.body;
    } else if (requestType === RequestType.GRAPHQL) {
      response = requests[i].response.data.testGQLQuery;
    } else if (requestType === RequestType.EVENT) {
      response = requests[i].response;
    }

    assertContext(response, requests[i].testValue, 1);
  }
}
