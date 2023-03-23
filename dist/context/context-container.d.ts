import { Context } from './context';
import { ModuleRef } from '@nestjs/core';
import { ContextConfigType, RequestType } from '../interfaces';
import { ClsService } from 'nestjs-cls';
export declare class ContextContainer {
    private readonly config;
    private readonly cls;
    private readonly moduleRef?;
    private contexts;
    private cache;
    constructor(config: ContextConfigType, cls: ClsService, moduleRef?: ModuleRef);
    static getId(request: RequestType): string;
    current(): Context;
    get(): Context;
    add(request: RequestType): Context;
    remove(): void;
}
