import { ClsService } from 'nestjs-cls';
import { Context, ContextContainer } from '../../../context';
import { ContextResponse } from '../../utils/context.utils';
import { AsyncRequestServiceExposer } from '../exposers/async-request-service-exposer.mock';
export declare class TestService {
    private readonly cls;
    private readonly context;
    private readonly contextContainer;
    private readonly asyncRequestService;
    private cache;
    constructor(cls: ClsService, context: Context, contextContainer: ContextContainer, asyncRequestService: AsyncRequestServiceExposer);
    clearContext(): void;
    testEmitEvent(testValue: string, awaitId?: string): Promise<ContextResponse>;
}
