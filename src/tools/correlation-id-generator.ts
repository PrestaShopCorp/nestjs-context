import * as short from 'short-uuid';

export const correlationIdGenerator = (
  alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
) => short(alphabet).generate();
