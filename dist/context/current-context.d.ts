import { ContextContainer } from './context-container';
import { Context } from './context';
export declare class CurrentContext {
    private readonly contexts;
    constructor(contexts: ContextContainer);
    private call;
    get(...args: Parameters<Context['get']>): any;
    getAll(...args: Parameters<Context['getAll']>): any;
    createView(...args: Parameters<Context['createView']>): any;
    getId(...args: Parameters<Context['getId']>): any;
    setCachedValue(...args: Parameters<Context['setCachedValue']>): any;
    getCachedValue(...args: Parameters<Context['getCachedValue']>): any;
}
