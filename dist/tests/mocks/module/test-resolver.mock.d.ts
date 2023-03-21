import { ClsService } from 'nestjs-cls';
import { Context } from '../../../context';
import { ContextContainerExposer } from '../exposers/context-container-exposer.mock';
import { AsyncRequestServiceExposer } from '../exposers/async-request-service-exposer.mock';
export declare class TestResolver {
    private readonly cls;
    private readonly context;
    private readonly contextContainer;
    private readonly asyncRequestService;
    constructor(cls: ClsService, context: Context, contextContainer: ContextContainerExposer, asyncRequestService: AsyncRequestServiceExposer);
    testGQLQuery(awaitId?: string): Promise<{
        clsId: string;
        context: any;
        contexts: string[];
    }>;
}
