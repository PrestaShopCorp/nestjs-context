import { BuildDtoType, ContextName } from '../interfaces';
type EasyOptions = BuildDtoType['build'];
type BuildDtoDecoratorOptions = BuildDtoType | EasyOptions;
export declare const buildDtoFactory: (options: BuildDtoType, request: any, addAuto?: (build: import("../interfaces").BuildContextType<ContextName.HTTP> | import("../interfaces").BuildContextType<ContextName.GQL_HTTP> | import("../interfaces").BuildContextType<ContextName.GQL_WS> | import("../interfaces").BuildContextType<ContextName.RPC> | import("../interfaces").BuildContextType<ContextName.WS>, options: Omit<BuildDtoType, "build">) => import("../interfaces").BuildContextType<ContextName.HTTP> | import("../interfaces").BuildContextType<ContextName.GQL_HTTP> | import("../interfaces").BuildContextType<ContextName.GQL_WS> | import("../interfaces").BuildContextType<ContextName.RPC> | import("../interfaces").BuildContextType<ContextName.WS>) => any;
export declare const buildDtoFullOptions: (options: BuildDtoDecoratorOptions) => BuildDtoType;
export declare const BuildDto: (...dataOrPipes: (BuildDtoDecoratorOptions | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
export {};
