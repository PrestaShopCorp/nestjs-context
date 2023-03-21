import { ClsService } from 'nestjs-cls';
import { Context } from '../../../context';
import { ContextResponseInterface } from '../../interfaces/context-response.interface';
import { AsyncRequestServiceExposer } from '../exposers/async-request-service-exposer.mock';
import { ContextContainerExposer } from '../exposers/context-container-exposer.mock';
export declare class TestController {
    private readonly cls;
    private readonly context;
    private readonly contextContainer;
    private readonly asyncRequestService;
    constructor(cls: ClsService, context: Context, contextContainer: ContextContainerExposer, asyncRequestService: AsyncRequestServiceExposer);
    testHttpRequest(awaitId?: string): Promise<ContextResponseInterface>;
}
