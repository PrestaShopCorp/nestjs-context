import { Context } from '../context';
import { Inject, Injectable } from '@nestjs/common';
import { ContextAwareInterface } from '../interfaces/context-aware.interface';
import { Constructor } from '../interfaces/constructor.interface';

export const __context = Symbol();

// This mixin adds a context property
export const ContextAwareMixin = () => {
  return <T extends Constructor<any>>(
    target: T,
  ): T & Constructor<ContextAwareInterface> => {
    if (Reflect.getOwnMetadata(__context, target)) {
      return target;
    }
    @Injectable()
    class ContextAwareClass extends target implements ContextAwareInterface {
      @Inject()
      private readonly [__context]: Context;
      public get __context() {
        return this[__context];
      }
    }
    Object.defineProperty(ContextAwareClass, 'name', { value: target.name });
    Reflect.defineMetadata(__context, true, target);
    return ContextAwareClass;
  };
};
