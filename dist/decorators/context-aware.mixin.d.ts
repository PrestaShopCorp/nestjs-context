import { ContextAwareInterface } from '../interfaces/context-aware.interface';
import { Constructor } from '../interfaces/constructor.interface';
export declare const __context: unique symbol;
export declare const ContextAwareMixin: () => <T extends Constructor<any>>(target: T) => T & Constructor<ContextAwareInterface>;
