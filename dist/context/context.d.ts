import { ModuleRef } from '@nestjs/core';
import { ContextConfigType, RequestType } from '../interfaces';
export declare class Context {
    private readonly id;
    private readonly config;
    readonly request: RequestType;
    private readonly moduleRef?;
    private readonly cache;
    private readonly build;
    constructor(id: number | string | symbol, config: ContextConfigType, request: RequestType, moduleRef?: ModuleRef);
    getId(): string | number | symbol;
    setCachedValue(key: string | symbol, value: any): this;
    getCachedValue(key: string | symbol): any;
    isCached(key: string | symbol): boolean;
    private getProvider;
    private buildContextValue;
    get(key: string): Record<string, any>;
    getAll(includeNull?: boolean): any;
    createView(mapping: any): Record<string, any>;
}
