import { ContextConfigType } from './context-config.type';
export declare type BuildDtoType = Partial<Pick<ContextConfigType, 'build' | 'type'>> & {
    target?: any;
    auto?: {
        enabled: boolean;
        prefix?: string;
        path?: string;
        blocklist?: string[];
    };
};
