import { ClsService } from 'nestjs-cls';
import 'reflect-metadata';
export declare class ClsDecoratorOptions<T extends any[]> {
    generateId?: boolean;
    idGenerator?: (...args: T) => string | Promise<string>;
    setup?: (cls: ClsService, ...args: T) => void | Promise<void>;
    teardown?: (...args: T) => void | Promise<void>;
    resolveProxyProviders?: boolean | undefined;
}
export declare function UseClsTeardown(): (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<(...args: any) => Promise<any>>) => void;
export declare function UseClsTeardown<TArgs extends any[]>(options: ClsDecoratorOptions<TArgs>): (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<(...args: TArgs) => Promise<any>>) => void;
