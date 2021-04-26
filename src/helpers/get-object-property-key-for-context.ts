import { InternalServerErrorException } from '@nestjs/common';
import { Context } from '../context';

export const getObjectPropertyKeyForContext = (o: any) => {
  let contextPropertyKey = Object.getOwnPropertyNames(o)
    .filter((key) => o[key] instanceof Context)
    .pop();
  if (!contextPropertyKey) {
    throw new InternalServerErrorException(
      `${Context.name} DI not found in ${o.constructor.name}`,
    );
  }
  return contextPropertyKey;
};
