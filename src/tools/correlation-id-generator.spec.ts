import { correlationIdGenerator } from './correlation-id-generator';

describe('correlationIdGenerator', () => {
  it('Generates a correlation id', () => {
    expect(correlationIdGenerator({})).toStrictEqual(expect.any(String));
  });
});
