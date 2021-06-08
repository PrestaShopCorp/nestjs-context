import { buildDtoFactory, buildDtoFullOptions } from './build-dto.decorator';
import { ContextName, IContextPropertyProvider } from '../interfaces';

describe('@BuildDto', () => {
  const fullOptions = {
    target: {},
    type: ContextName.HTTP,
    build: {},
  };
  it('accepts as argument both context-build like definition or a full build-dto definition', () => {
    expect(buildDtoFullOptions({})).toStrictEqual({
      type: ContextName.HTTP,
      build: {},
    });
    expect(buildDtoFullOptions({ target: {}, build: {} } as any)).toStrictEqual(
      {
        target: {},
        type: ContextName.HTTP,
        build: {},
      },
    );
    expect(buildDtoFullOptions(fullOptions)).toStrictEqual(fullOptions);
  });
  it('builds a dto from the request and custom values, custom callbacks and providers', () => {
    class Provider implements IContextPropertyProvider {
      get() {
        return 'provider';
      }
    }
    const builder = jest.fn(() => ({})) as any;
    const dto = buildDtoFactory(
      {
        ...fullOptions,
        build: {
          request: ['req.headers.test'],
          value: ['value'],
          callback: [(req) => req.headers.test],
        },
        auto: { enabled: false },
      },
      { headers: { test: 'ok' } },
      builder,
    );
    // TODO : to make Providers work, we should use SetMetadata instead and create an
    //  explorer that adds the dependency to the controllers using the BuildDto
    expect(dto).toStrictEqual({
      request: 'ok',
      value: 'value',
      callback: 'ok',
      // provider: 'provider',
    });
    expect(builder).not.toHaveBeenCalled();
  });
  it('builds -automatically- a dto from the request if auto was enabled, even if build definition is not defined', () => {
    const builder = jest.fn(() => ({
      test: ['req.headers.test'],
    })) as any;
    expect(
      buildDtoFactory(
        { type: ContextName.HTTP, target: {}, auto: { enabled: true } },
        { headers: { test: 1 } },
        builder,
      ),
    ).toStrictEqual({ test: 1 });
    expect(builder).toHaveBeenCalled();
  });
  it('builds an empty dto for empty build definition if auto is disabled', () => {
    const builder = jest.fn(() => ({})) as any;
    expect(
      buildDtoFactory(fullOptions, { headers: { test: 1 } }, builder),
    ).toStrictEqual({});
    expect(builder).not.toHaveBeenCalled();
  });
});
