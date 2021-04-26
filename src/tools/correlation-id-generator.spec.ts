import { correlationIdGenerator } from './correlation-id-generator';

describe('correlationIdGenerator', () => {
  const map = {
    get: jest.fn(),
    set: jest.fn(),
  };
  it('adds a correlation id to the setValues on its first call', () => {
    correlationIdGenerator('correlation-id')({}, map);
    expect(map.set).toHaveBeenCalledWith('correlation-id', expect.any(String));
    expect(map.get).toHaveBeenCalled();
  });
  it('returns the same correlation-id after that', () => {
    expect(correlationIdGenerator('correlation-id')({}, map)).toBe(
      map.get('correlation-id'),
    );
  });
});
