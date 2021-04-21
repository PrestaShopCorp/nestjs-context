import { CONTEXT_CORRELATION_ID } from '..';
import { getObjectPropertyKeyForContext } from '../helpers';

export const CorrelationId = () => (target: any, propertyKey: string) => {
  Object.defineProperty(target, propertyKey, {
    configurable: false,
    enumerable: true,
    get(): any {
      const contextPropertyKey = getObjectPropertyKeyForContext(this);
      const context = this[contextPropertyKey];
      return context.get(CONTEXT_CORRELATION_ID);
    },
    set: undefined,
  });
};
