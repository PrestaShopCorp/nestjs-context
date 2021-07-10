import { CorrelationId } from './correlation-id.decorator';
import { Context } from '../context';
import { contextInstanceMock } from '../tests/mocks/context-instance.mock';
import { CONTEXT_CORRELATION_ID } from '../constants';
import { ContextAware } from './context-aware.decorator';
import { __context } from './context-aware.mixin';

describe(`@${CorrelationId.name}`, () => {
  it(`should throw an error if targeted class has not been decorated with @${ContextAware.name}`, () => {
    try {
      class WithoutContext {
        @CorrelationId()
        private readonly correlationId;
      }
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
  it('should get the correlation-id property from the context', () => {
    @ContextAware()
    class WithPropertyClass {
      @CorrelationId()
      public readonly correlationId;
    }
    const instance = new WithPropertyClass();
    // mock context
    instance[__context] = contextInstanceMock;
    // the mockup get returns the key instead of the value, so we can test it
    expect(instance.correlationId).toBe(CONTEXT_CORRELATION_ID);
  });
});
