import { CONTEXT_CORRELATION_ID } from '..';
import { getObjectPropertyKeyForContext } from '../helpers';

/**
 * Note: you need to add Context as DI to use this decorator
 *  Note: this decorator converts your object property into an accessor descriptor instead of
 *  data descriptor, and it will use another data descriptor as backup for the rest of sub-properties
 * @constructor
 */
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
