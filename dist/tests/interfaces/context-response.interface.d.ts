import { ContextInterface } from './context.interface';
export interface ContextResponseInterface {
    clsId: string;
    context: ContextInterface;
    contexts: Array<string>;
}
