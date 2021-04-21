import {
  ConfigType,
  ContextName,
  IContextPropertyProvider,
} from '../interfaces';
import { Context } from './context';

describe('Context', () => {
  class Provider implements IContextPropertyProvider {
    get() {
      return 'provider';
    }
  }
  const moduleRef: any = {
    get: (key) => (key === Provider ? new Provider() : null),
  };
  const request: any = {
    headers: { header: 'header' },
  };
  const build = {
    value: ['value-fallback', 'value'],
    fallback: ['fallback', 'headers.fallback'],
    header: ['headers.header'],
    provider: [Provider],
    callback: [() => 'callback'],
    nullish: ['headers.null'],
  };
  const config: ConfigType = {
    type: ContextName.HTTP,
    build,
  };
  const context = new Context(config, request, moduleRef);
  const ctxPayloadWithoutNull = {
    value: build.value[1],
    fallback: build.fallback[0],
    header: request.headers.header,
    provider: moduleRef.get(Provider).get(),
    callback: build.callback[0](),
  };

  it('gets last value in LIFO (does not fallback) if the last build definition was found', () => {
    expect(context.get('value')).toBe(ctxPayloadWithoutNull.value);
  });
  it('gets LIFO fallback if the last build definition was not found', () => {
    expect(context.get('fallback')).toBe(ctxPayloadWithoutNull.fallback);
  });
  it('gets an element from the context request', () => {
    expect(context.get('header')).toBe(ctxPayloadWithoutNull.header);
  });
  it('gets a value from a provider', () => {
    expect(context.get('provider')).toBe(ctxPayloadWithoutNull.provider);
  });
  it('gets an element from a callback', () => {
    expect(context.get('callback')).toBe(ctxPayloadWithoutNull.callback);
  });
  it('gets the full context without nullish and undefined', () => {
    expect(context.getAll(false)).toStrictEqual(ctxPayloadWithoutNull);
  });
  it('gets the full context with nullish and undefined', () => {
    expect(context.getAll(true)).toStrictEqual({
      ...ctxPayloadWithoutNull,
      nullish: null,
    });
  });
});
