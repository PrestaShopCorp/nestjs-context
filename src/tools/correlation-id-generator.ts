import * as short from 'short-uuid';
import { BuildContextFromCallbackType } from '../interfaces';

const alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
export const correlationIdGenerator: BuildContextFromCallbackType = () => {
  return short(alphabet).generate();
};
