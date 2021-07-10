import { AddCorrelationId } from './add-correlation-id.decorator';
import { contextInstanceMock } from '../tests/mocks/context-instance.mock';
import { CONTEXT_CORRELATION_ID } from '../constants';
import { __context } from './context-aware.mixin';

describe(`@${AddCorrelationId.name}`, () => {
  @AddCorrelationId('correlationId')
  class WithPropertyClass {
    public readonly correlationId;
  }
  it(`should enhance component with __context metadata`, () => {
    expect(Reflect.getMetadata(__context, WithPropertyClass)).toBeTruthy();
  });
  it('should get the value of correlation-id property from the context', () => {
    @AddCorrelationId('correlationId')
    class WithPropertyClass {
      public readonly correlationId;
    }
    const instance = new WithPropertyClass();
    // mock context
    instance[__context] = contextInstanceMock;
    // the mockup get returns the key instead of the value, so we can test it
    expect(instance.correlationId).toBe(CONTEXT_CORRELATION_ID);
  });
  it('should get the value of correlation-id sub-property from the context', () => {
    @AddCorrelationId('metadata.correlation_id')
    class WithPropertyClass {
      public readonly metadata;
    }
    const instance = new WithPropertyClass();
    // mock context
    instance[__context] = contextInstanceMock;
    // the mockup get returns the key instead of the value, so we can test it
    expect(instance.metadata.correlation_id).toBe(CONTEXT_CORRELATION_ID);
  });
});
