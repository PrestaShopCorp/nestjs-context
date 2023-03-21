import { ClsService } from 'nestjs-cls';
import { Context, ContextContainer } from '../../../context';
import { ContextResponse } from '../../utils/context.utils';
import { ContextContainerExposer } from '../exposers/context-container-exposer.mock';
import { AsyncRequestServiceExposer } from '../exposers/async-request-service-exposer.mock';
export declare class TestService {
    private readonly cls;
    private readonly context;
    private readonly contextContainer;
    private readonly contextContainerExposer;
    private readonly asyncRequestService;
    constructor(cls: ClsService, context: Context, contextContainer: ContextContainer, contextContainerExposer: ContextContainerExposer, asyncRequestService: AsyncRequestServiceExposer);
    clearContext(): void;
    testEmitEvent(testValue: string, awaitId?: string): Promise<ContextResponse>;
}
