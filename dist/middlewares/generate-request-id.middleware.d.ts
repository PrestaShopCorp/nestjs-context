import { NestMiddleware } from '@nestjs/common';
import { ContextConfigType } from '../interfaces';
import { Context } from '../context';
export declare class GenerateRequestIdMiddleware implements NestMiddleware {
    private readonly context;
    private readonly config;
    constructor(context: Context, config: ContextConfigType);
    use(req: any, res: any, next: () => void): void;
}
