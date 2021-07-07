import * as short from 'short-uuid';
import { BuildContextFromCallbackType } from '../interfaces';

const alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
export const generateId: BuildContextFromCallbackType = () => {
  return short(alphabet).generate();
};
