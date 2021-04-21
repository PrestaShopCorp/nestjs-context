import { InternalServerErrorException } from '@nestjs/common';
import { Context } from '../services';

export const getObjectPropertyKeyForContext = ($this) => {
  let contextPropertyKey = Object.getOwnPropertyNames($this)
    .filter((key) => $this[key] instanceof Context)
    .pop();
  if (!contextPropertyKey) {
    throw new InternalServerErrorException(
      `${Context.name} DI not found in ${$this.constructor.name}`,
    );
  }
  return contextPropertyKey;
};
