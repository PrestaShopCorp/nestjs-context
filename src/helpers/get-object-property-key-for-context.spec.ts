import { InternalServerErrorException } from '@nestjs/common';
import { Context } from '../context';
import { getObjectPropertyKeyForContext } from './get-object-property-key-for-context';

describe('getObjectPropertyKeyForContext', () => {
  it(`gets the given object property key that contains a ${Context.name} instance`, () => {
    class Test {
      private readonly context: Context = new Context(null, null);
    }
    expect(getObjectPropertyKeyForContext(new Test())).toBe('context');
  });
  it(`gets throws an error if the object does not contain a ${Context.name} instance`, () => {
    class Test {
      private readonly context: Context;
    }
    try {
      expect(getObjectPropertyKeyForContext(new Test()));
    } catch (e) {
      expect(e).toBeInstanceOf(InternalServerErrorException);
    }
  });
});
