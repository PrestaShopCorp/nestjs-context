import { ContextResponseInterface } from '../interfaces/context-response.interface';
import { Context } from './context.model';
export declare class ContextResponse implements ContextResponseInterface {
    clsId: string;
    context: Context;
    contexts: Array<string>;
}
