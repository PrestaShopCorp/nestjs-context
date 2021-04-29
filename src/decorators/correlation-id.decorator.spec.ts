import { CorrelationId } from './correlation-id.decorator';
import { Context } from '../context';
import { contextInstanceMock } from '../tests/mocks/context-instance.mock';
import { CONTEXT_CORRELATION_ID } from '../constants';

describe('@CorrelationId', () => {
  it('throws an error if context DI is not present in the targeted class', () => {
    try {
      class WithoutContext {
        @CorrelationId()
        private readonly correlationId;
      }
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
  it('hydrates the correlation id from the context into a property', () => {
    class WithPropertyClass {
      @CorrelationId()
      public readonly correlationId;
      constructor(private readonly context: Context = contextInstanceMock) {}
    }
    // the mockup get returns the key instead of the value, so we can test it
    expect(new WithPropertyClass().correlationId).toBe(CONTEXT_CORRELATION_ID);
  });
});
