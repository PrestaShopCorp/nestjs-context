import * as short from 'short-uuid';

const alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
export const correlationIdGenerator = () => short(alphabet).generate();
