import * as short from 'short-uuid';
import { BuildContextFromCallbackType } from '../interfaces';

const alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
export const correlationIdGenerator: BuildContextFromCallbackType = (
  key: string | symbol,
) => (req, setValues) => {
  if (!setValues.get(key)) {
    setValues.set(key, short(alphabet).generate());
  }
  return setValues.get(key);
};
