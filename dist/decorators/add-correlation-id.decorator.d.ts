import { Constructor } from '../interfaces/constructor.interface';
export declare const AddCorrelationId: (path: string) => <T extends Constructor<any>>(target: T) => T & Constructor<any> & Constructor<import("../interfaces/context-aware.interface").ContextAwareInterface>;
