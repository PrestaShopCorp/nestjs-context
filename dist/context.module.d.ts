import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ContextConfigType } from './interfaces';
import { Context, ContextContainer } from './context';
export declare const createContextModule: (config?: ContextConfigType) => {
    module: typeof ContextModule;
    providers: import("@nestjs/common").Provider<any>[];
    imports: (import("@nestjs/common").Type<any> | import("@nestjs/common").DynamicModule | Promise<import("@nestjs/common").DynamicModule> | import("@nestjs/common").ForwardReference<any>)[];
    exports: (typeof Context | typeof ContextContainer)[];
    global: boolean;
};
export declare class ContextModule implements NestModule {
    private readonly config;
    private alreadyRegister;
    constructor(config: ContextConfigType);
    static registerWithDefaults(config?: ContextConfigType): {
        module: typeof ContextModule;
        providers: import("@nestjs/common").Provider<any>[];
        imports: (import("@nestjs/common").Type<any> | import("@nestjs/common").DynamicModule | Promise<import("@nestjs/common").DynamicModule> | import("@nestjs/common").ForwardReference<any>)[];
        exports: (typeof Context | typeof ContextContainer)[];
        global: boolean;
    };
    static register(config?: ContextConfigType): {
        module: typeof ContextModule;
        providers: import("@nestjs/common").Provider<any>[];
        imports: (import("@nestjs/common").Type<any> | import("@nestjs/common").DynamicModule | Promise<import("@nestjs/common").DynamicModule> | import("@nestjs/common").ForwardReference<any>)[];
        exports: (typeof Context | typeof ContextContainer)[];
        global: boolean;
    };
    configure(consumer: MiddlewareConsumer): void;
}
