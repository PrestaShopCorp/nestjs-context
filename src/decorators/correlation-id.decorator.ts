import { InternalServerErrorException } from '@nestjs/common';
import { Context, CONTEXT_CORRELATION_ID } from '../index';
import { getObjectPropertyKeyForContext } from '../helpers';

export const CorrelationId = () => (target: any, propertyKey: string) => {
  Object.defineProperty(target, propertyKey, {
    configurable: false,
    enumerable: true,
    get(): any {
      const contextPropertyKey = getObjectPropertyKeyForContext(this);
      const context = this[contextPropertyKey];
      if (!context || !(context instanceof Context)) {
        throw new InternalServerErrorException(
          `You need to inject ${Context.name} DI to ${this.constructor.name}::${contextPropertyKey} to use @CorrelationId on it`,
        );
      }
      return context.get(CONTEXT_CORRELATION_ID);
    },
    set: undefined,
  });
};
