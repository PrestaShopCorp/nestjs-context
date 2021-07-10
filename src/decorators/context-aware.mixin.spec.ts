import { Inject } from '@nestjs/common';
import { PROPERTY_DEPS_METADATA } from '@nestjs/common/constants';
import { __context, ContextAwareMixin } from './context-aware.mixin';
import { ContextAware } from './context-aware.decorator';
import { Context } from '../context';

describe(`@${ContextAware.name}`, () => {
  class BaseClass {}
  const WithPropertyClass = ContextAwareMixin()(BaseClass);
  it(`should enhance component with __context metadata`, () => {
    expect(Reflect.getMetadata(__context, WithPropertyClass)).toBeTruthy();
  });
  it(`should @${Inject} the ${Context.name} into a random [Symbol()] property`, () => {
    expect(
      Reflect.getMetadata(PROPERTY_DEPS_METADATA, WithPropertyClass),
    ).toStrictEqual([{ key: __context, type: Context.name }]);
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
