import { HEADER_REQUEST_ID } from '../constants';
import { ContextConfigType, RequestType } from '../interfaces';
import { ContextName } from '../interfaces/context-name.enum';
import { ContextContainer } from './context-container';

describe('context-container test', () => {
  let config: ContextConfigType;
  let request: RequestType;
  let request2: RequestType;

  beforeEach(() => {
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
  });

  it('should create a context from a request', () => {
    const container = new ContextContainer(config);
    const context = container.createContextFromRequest(request);

    expect(context.getId()).toEqual('request_id_1');
  });

  it('should create a non http context', () => {
    const container = new ContextContainer(config);
    const context = container.createNonHttpContext();

    expect(context.getId()).not.toBeNull();
  });

  it('should add context', () => {
    const container = new ContextContainer(config);
    const context = container.createContextFromRequest(request);
    container.addContext(context);

    expect(container.getContextsSize()).toBe(1);
    expect(container.getContextFromRequest(request)).toEqual(context);
  });

  it('should create and add a context from a request', () => {
    const container = new ContextContainer(config);
    container.createAndAddContextFromRequest(request);

    expect(container.getContextsSize()).toBe(1);
    expect(container.getContextFromRequest(request).getId()).toEqual('request_id_1');
  });

  it('should get a context from an id', () => {
    const container = new ContextContainer(config);
    container.createAndAddContextFromRequest(request);

    expect(container.getContextsSize()).toBe(1);
    expect(container.getContextFromId('request_id_1').getId()).toEqual('request_id_1');
  });

  it('should remove an existing context', () => {
    const container = new ContextContainer(config);
    const context = container.createContextFromRequest(request);
    container.addContext(context);
    container.removeContextFromRequest(request);

    expect(container.getContextsSize()).toBe(0);
    expect(container.getContextFromRequest(request)).toBeNull();
  });

  it('should be ok when remove an non existing context', () => {
    const container = new ContextContainer(config);

    expect(container.getContextFromRequest(request)).toBeNull();
    container.removeContextFromRequest(request);
  });

  it('should add 2 contexts from 2 distinct requests', () => {
    const container = new ContextContainer(config);
    const context1 = container.createContextFromRequest(request);
    container.addContext(context1);
    const context2 = container.createContextFromRequest(request2);
    container.addContext(context2);

    expect(context1.getId()).toEqual('request_id_1');
    expect(context2.getId()).toEqual('request_id_2');

    expect(container.getContextsSize()).toBe(2);
  });

  it('should add 2 contexts and remove them (chrono order) without errors', () => {
    const container = new ContextContainer(config);
    const context1 = container.createContextFromRequest(request);
    container.addContext(context1);
    const context2 = container.createContextFromRequest(request2);
    container.addContext(context2);

    expect(context1.getId()).toEqual('request_id_1');
    expect(context2.getId()).toEqual('request_id_2');

    container.removeContextFromRequest(request);
    expect(container.getContextFromRequest(request)).toBeNull();
    expect(container.getContextFromRequest(request2).getId()).toEqual('request_id_2');

    container.removeContextFromRequest(request2);
    expect(container.getContextFromRequest(request2)).toBeNull();
    expect(container.getContextsSize()).toBe(0);
  });

  it('should add 2 contexts and remove them (invert order)', () => {
    const container = new ContextContainer(config);
    const context1 = container.createContextFromRequest(request);
    container.addContext(context1);
    const context2 = container.createContextFromRequest(request2);
    container.addContext(context2);

    expect(context1.getId()).toEqual('request_id_1');
    expect(context2.getId()).toEqual('request_id_2');

    container.removeContextFromRequest(request2);
    expect(container.getContextFromRequest(request2)).toBeNull();
    expect(container.getContextFromRequest(request).getId()).toEqual('request_id_1');

    container.removeContextFromRequest(request);
    expect(container.getContextFromRequest(request)).toBeNull();
    expect(container.getContextsSize()).toBe(0);
  });
});
