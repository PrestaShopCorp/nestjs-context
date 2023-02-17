import { __context, ContextAwareMixin } from './context-aware.mixin';
import { ContextAware } from './context-aware.decorator';

describe(`@${ContextAware.name}`, () => {
  class BaseClass {}
  const WithPropertyClass = ContextAwareMixin()(BaseClass);

  it(`should enhance component with __context metadata`, () => {
    expect(Reflect.getMetadata(__context, WithPropertyClass)).toBeTruthy();
  });

  it(`should declare a get __context to access the random [Symbol()] property`, () => {
    expect(
      typeof Object.getOwnPropertyDescriptor(
        WithPropertyClass.prototype,
        '__context',
      ).get,
    ).toBe('function');
    expect(
      typeof Object.getOwnPropertyDescriptor(
        WithPropertyClass.prototype,
        '__context',
      ).set,
    ).toBe('undefined');
  });
});
