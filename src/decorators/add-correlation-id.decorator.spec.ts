import { AddCorrelationId } from './add-correlation-id.decorator';
import { Context } from '../context';
import { contextInstanceMock } from '../tests/mocks/context-instance.mock';
import { CONTEXT_CORRELATION_ID } from '../constants';

describe('@AddCorrelationId', () => {
  it('throws an error if context DI is not present in the targeted class', () => {
    try {
      @AddCorrelationId('metadata.correlationId')
      class WithoutContext {
        private readonly metadata;
      }
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
  it('hydrates the correlation id from the context into a property', () => {
    @AddCorrelationId('correlationId')
    class WithPropertyClass {
      public readonly correlationId;
      constructor(private readonly context: Context = contextInstanceMock) {}
    }
    // the mockup get returns the key instead of the value, so we can test it
    expect(new WithPropertyClass().correlationId).toBe(CONTEXT_CORRELATION_ID);
  });
  it('hydrates the correlation id from the context into a sub-property', () => {
    @AddCorrelationId('metadata.correlationId')
    class WithPropertyClass {
      public readonly metadata;
      constructor(private readonly context: Context = contextInstanceMock) {}
    }
    // the mockup get returns the key instead of the value, so we can test it
    expect(new WithPropertyClass().metadata.correlationId).toBe(
      CONTEXT_CORRELATION_ID,
    );
  });
});
