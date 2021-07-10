import { cloneDeep, set } from 'lodash';
import { CONTEXT_CORRELATION_ID } from '../index';
import { Constructor } from '../interfaces/constructor.interface';
import { ContextAwareMixin } from './context-aware.mixin';

const PathCorrelationIdAware = (path: string) => <T extends Constructor<any>>(
  Target: T,
): T & Constructor<any> => {
  const correlationIdPathParts = path.split('.');
  const accessorPropertyName = correlationIdPathParts.shift() as NonNullable<string>;
  const dataPropertyName = `__add-correlation-id-${accessorPropertyName}`;

  const newClass = class extends Target {
    constructor(...args: any[]) {
      super(...args);
      const descriptor = this[accessorPropertyName]
        ? cloneDeep(this[accessorPropertyName])
        : {};
      Object.defineProperty(this, dataPropertyName, {
        enumerable: false,
        value: descriptor,
      });
      Object.defineProperty(this, accessorPropertyName, {
        enumerable: true,
        get() {
          if (correlationIdPathParts.length === 0) {
            return this.__context.get(CONTEXT_CORRELATION_ID);
          }
          return set(
            this[dataPropertyName],
            correlationIdPathParts,
            this.__context.get(CONTEXT_CORRELATION_ID),
          );
        },
        set(value: any) {
          this[dataPropertyName] = value;
        },
      });
    }
  };
  Object.defineProperty(newClass, 'name', {
    value: Target.name,
  });

  return newClass;
};

/**
 * Note: this decorator converts your object property into an accessor descriptor instead
 * of data descriptor and it will use another data descriptor as backup for the rest
 * of sub-properties
 * @param path
 * @constructor
 */
export const AddCorrelationId = (path: string) => <T extends Constructor<any>>(
  target: T,
) => {
  return ContextAwareMixin()(PathCorrelationIdAware(path)(target));
};
