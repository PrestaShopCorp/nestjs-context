import { Context } from '../context';
import { ContextConfigType } from '../interfaces';
import { NestMiddleware } from '@nestjs/common';
export declare class SetResponseCorrelationIdMiddleware implements NestMiddleware {
    private readonly context;
    private readonly config;
    constructor(context: Context, config: ContextConfigType);
    protected setResponseCorrelationId(response: any): void;
    use(req: any, res: any, next: () => void): void;
}
