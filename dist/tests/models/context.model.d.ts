import { ContextType } from '../utils/context.utils';
export declare class Context implements ContextType {
    id: string;
    request_id: string;
    correlation_id: string;
    platform: string;
    hostname: string;
    bin: string;
    path: string;
    protocol: string;
    testValue: string;
}
