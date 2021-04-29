import { InternalServerErrorException } from '@nestjs/common';
import { cloneDeep, set } from 'lodash';
import { CONTEXT_CORRELATION_ID } from '../index';
import { getObjectPropertyKeyForContext } from '../helpers';

/**
 * Note: this decorator converts your object property into an accessor descriptor instead
 * of data descriptor and it will use another data descriptor as backup for the rest
 * of sub-properties
 * @param path
 * @constructor
 */
export const AddCorrelationIdDecorator = (path: string) => <
  T extends { new (...args: any[]): any }
>(
  Target: T,
) => {
  if (!path.length) {
    throw new InternalServerErrorException(
      '@AddCorrelationId path argument must have at least 1 character',
    );
  }
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
      const contextPropertyKey = getObjectPropertyKeyForContext(this);
      Object.defineProperty(this, accessorPropertyName, {
        enumerable: true,
        get() {
          const context = this[contextPropertyKey];
          if (correlationIdPathParts.length === 0) {
            return context.get(CONTEXT_CORRELATION_ID);
          }
          return set(
            this[dataPropertyName],
            correlationIdPathParts,
            context.get(CONTEXT_CORRELATION_ID),
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
