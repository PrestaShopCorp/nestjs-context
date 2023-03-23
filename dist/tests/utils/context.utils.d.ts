import { ContextResponseInterface } from '../interfaces/context-response.interface';
import { ContextInterface } from '../interfaces/context.interface';
export declare enum RequestType {
    HTTP = "http",
    GRAPHQL = "graphql",
    EVENT = "event"
}
export type ContextType = ContextInterface & {
    testValue: string;
};
export type ContextResponse = {
    context: ContextType;
} & Pick<ContextResponseInterface, 'clsId' | 'contexts'>;
export declare function assertContext(response: ContextResponse, contextTestValue: string, contextStackLength: number): void;
export declare function assertMultipleContext(nb: number, requests: Record<string, any>, requestType: RequestType): void;
