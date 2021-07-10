import { CONTEXT_CORRELATION_ID } from '..';

/**
 *  IMPORTANT: To use this decorator you need to decorate your provider with "@ContextAware"
 *  to use this decorator
 *
 *  Note: this decorator converts your object property into an accessor descriptor instead of
 *  data descriptor, and it will use another data descriptor as backup for the rest of sub-properties
 * @constructor
 */
export const CorrelationId = () => (target: any, propertyKey: string) => {
  Object.defineProperty(target, propertyKey, {
    configurable: false,
    enumerable: true,
    get(): any {
      return this.__context.get(CONTEXT_CORRELATION_ID);
    },
    set: undefined,
  });
};
