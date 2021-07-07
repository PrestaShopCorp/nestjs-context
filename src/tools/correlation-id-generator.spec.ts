import { generateId } from './generate-id';

describe('correlationIdGenerator', () => {
  it('Generates a correlation id', () => {
    expect(generateId({})).toStrictEqual(expect.any(String));
  });
});
