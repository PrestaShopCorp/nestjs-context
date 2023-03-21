import { Inject } from '@nestjs/common';
import {
  ClsService,
  ClsServiceManager,
  CLS_ID,
  ClsDecoratorOptions as DecoratorOptions,
} from 'nestjs-cls';
import 'reflect-metadata';
import { ContextContainer } from '../context';

export declare class ClsDecoratorOptions<T extends any[]> {
  /**
   * Whether to automatically generate request ids
   */
  generateId?: boolean;
  /**
   * The function to generate request ids inside the interceptor.
   *
   * Takes the same parameters in the same order as the decorated function.
   *
   * Note: To avoid type errors, you must list all parameters, even if they're not used,
   * or type the decorator as `@UseClsTeardown<[arg1: Type1, arg2: Type2]>()`
   */
  idGenerator?: (...args: T) => string | Promise<string>;
  /**
   * Function that executes after the CLS context has been initialised.
   * Takes ClsService as the first parameter and then the same parameters in the same order as the decorated function.
   *
   * Note: To avoid type errors, you must list all parameters, even if they're not used,
   * or type the decorator as `@Teardown<[arg1: Type1, arg2: Type2]>()`
   */
  setup?: (cls: ClsService, ...args: T) => void | Promise<void>;
  /**
   * Function that executes after the CLS context has been executed (post process).
   *
   * Note: To avoid type errors, you must list all parameters, even if they're not used,
   * or type the decorator as `@UseClsTeardown<[arg1: Type1, arg2: Type2]>()`
   */
  teardown?: (...args: T) => void | Promise<void>;
  /**
   * Whether to resolve proxy providers as a part
   * of the CLS context registration
   *
   * Default: `false`
   */
  resolveProxyProviders?: boolean | undefined;
}

/**
 * Wraps the decorated method in a CLS context with teardown.
 */
export function UseClsTeardown(): (
  target: any,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<(...args: any) => Promise<any>>,
) => void;

/**
 * Wraps the decorated method in a CLS context with teardown.
 *
 * @param options takes similar options to the enhancers.
 */
export function UseClsTeardown<TArgs extends any[]>(
  options: ClsDecoratorOptions<TArgs>,
): (
  target: any,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<(...args: TArgs) => Promise<any>>,
) => void;

export function UseClsTeardown<TArgs extends any[]>(
  maybeOptions?: ClsDecoratorOptions<TArgs>,
) {
  const injectContextContainer = Inject(ContextContainer);
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: TArgs) => Promise<any>>,
  ) => {
    const decoratorOptions = new DecoratorOptions();
    const options = { ...decoratorOptions, ...maybeOptions };
    const cls = ClsServiceManager.getClsService();
    const original = descriptor.value;
    if (typeof original !== 'function') {
      throw new Error(
        `The @UseClsTeardown decorator can be only used on functions, but ${propertyKey.toString()} is not a function.`,
      );
    }
    descriptor.value = function (...args: TArgs) {
      return cls
        .run(async () => {
          if (options.generateId) {
            const id = await options.idGenerator?.apply(this, args);
            cls.set<string>(CLS_ID, id);
          }
          if (options.setup) {
            await options.setup.apply(this, [cls, ...args]);
          }
          if (options.resolveProxyProviders) {
            await cls.resolveProxyProviders();
          }
          return original.apply(this, args);
        })
        .then((response) => {
          // if (!target.__myCtxContainer) {
          // console.log('target', target, propertyKey);
          injectContextContainer(target, '__myCtxContainer');
          // }

          const contextContainer: ContextContainer = this.__myCtxContainer;
          // contextContainer.remove();

          return response;
        });
      // .then(async (response) => {
      // const result = await response;
      // options.teardown && (await options.teardown.apply(this, args));

      // return result;
      // await response;
      // contextContainer.remove()/
      // });
      // .then(async (response) => {
      // if (options.teardown && (await response)) {
      //     return await options.teardown.apply(this, args);
      //  }
      // })
    };
    copyMetadata(original, descriptor.value);
  };
}

/**
 * Copies all metadata from one object to another.
 * Useful for overwriting function definition in
 * decorators while keeping all previously
 * attached metadata
 *
 * @param from object to copy metadata from
 * @param to object to copy metadata to
 */
function copyMetadata(from: any, to: any) {
  const metadataKeys = Reflect.getMetadataKeys(from);
  metadataKeys.map((key) => {
    const value = Reflect.getMetadata(key, from);
    Reflect.defineMetadata(key, value, to);
  });
}
