import { ModuleMetadata } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { BuildContextType } from './build-context.type';
import { ContextName } from './context-name.enum';
declare type CommonConfig = {
    cached?: boolean;
    addDefaults?: boolean;
    providers?: ModuleMetadata['providers'];
    imports?: ModuleMetadata['imports'];
    correlation_id?: {
        routes?: RouteInfo;
        header?: string;
    };
};
export declare type ContextConfigType = CommonConfig & ({
    type: ContextName.HTTP;
    build: BuildContextType<ContextName.HTTP>;
} | {
    type: ContextName.GQL_HTTP;
    build: BuildContextType<ContextName.GQL_HTTP>;
} | {
    type: ContextName.GQL_WS;
    build: BuildContextType<ContextName.GQL_WS>;
} | {
    type: ContextName.RPC;
    build: BuildContextType<ContextName.RPC>;
} | {
    type: ContextName.WS;
    build: BuildContextType<ContextName.WS>;
});
export {};
