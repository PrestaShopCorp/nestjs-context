import { NestMiddleware } from '@nestjs/common';
import { ContextConfigType } from '../interfaces';
import { Context } from '../context';
export declare class GenerateCorrelationIdMiddleware implements NestMiddleware {
    private readonly context;
    private readonly config;
    constructor(context: Context, config: ContextConfigType);
    protected generateCorrelationId(request: any): void;
    use(req: any, res: any, next: () => void): void;
}
