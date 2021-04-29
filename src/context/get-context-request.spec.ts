import { getContextRequest } from './get-context.request';
import { ContextName } from '../interfaces';
import { ExecutionContext } from '@nestjs/common';

describe('getContextRequest', () => {
  const executionContext = {
    switchToHttp: () => ({
      getRequest: () => 'request',
    }),
    switchToWs: () => ({
      getData: () => 'data-ws',
    }),
    switchToRpc: () => ({
      getData: () => 'data-rpc',
    }),
  } as ExecutionContext;
  it(`returns request for ${ContextName.HTTP} context`, () => {
    expect(getContextRequest(ContextName.HTTP, executionContext)).toBe(
      'request',
    );
  });
  it(`returns request for ${ContextName.GQL} context`, () => {
    expect(getContextRequest(ContextName.GQL, executionContext)).toBe(
      'data-ws',
    );
  });
  it(`returns data for ${ContextName.WS} context`, () => {
    expect(getContextRequest(ContextName.WS, executionContext)).toBe('data-ws');
  });
  it(`returns data for ${ContextName.RPC} context`, () => {
    expect(getContextRequest(ContextName.RPC, executionContext)).toBe(
      'data-rpc',
    );
  });
});
