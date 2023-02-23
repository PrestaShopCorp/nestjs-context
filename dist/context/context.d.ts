import { ModuleRef } from '@nestjs/core';
import { ContextConfigType, RequestType } from '../interfaces';
export declare class Context {
    private readonly id;
    private readonly config;
    readonly request: RequestType;
    private readonly moduleRef?;
    private readonly cache;
    private readonly build;
    constructor(id: number | string | Symbol, config: ContextConfigType, request: RequestType, moduleRef?: ModuleRef);
    getId(): string | number | Symbol;
    setCachedValue(key: string | symbol, value: any): this;
    getCachedValue(key: string | symbol): any;
    isCached(key: string | symbol): boolean;
    private getProvider;
    private buildContextValue;
    get(key: any): any;
    getAll(includeNull?: boolean): any;
    createView(mapping: any): Record<string, any>;
}
