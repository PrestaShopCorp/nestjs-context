import { NestMiddleware } from '@nestjs/common';
import { ContextContainer } from '../context/context-container';
export declare class CreateContextMiddleware implements NestMiddleware {
    private readonly contexts;
    constructor(contexts: ContextContainer);
    use(req: any, res: any, next: () => void): void;
}
