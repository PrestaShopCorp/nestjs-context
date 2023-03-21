/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Query, Resolver } from '@nestjs/graphql';
import { ContextResponse } from '../../models/context-response.model';
import { ClsService } from 'nestjs-cls';
import { Context } from '../../../context';
import { ContextContainerExposer } from '../exposers/context-container-exposer.mock';
import { AsyncRequestServiceExposer } from '../exposers/async-request-service-exposer.mock';

@Resolver((of) => ContextResponse)
export class TestResolver {
  constructor(
    private readonly cls: ClsService,
    private readonly context: Context,
    private readonly contextContainer: ContextContainerExposer,
    private readonly asyncRequestService: AsyncRequestServiceExposer,
  ) {}

  @Query((returns) => ContextResponse)
  async testGQLQuery(
    @Args('awaitId', { type: () => String, nullable: true }) awaitId?: string,
  ) {
    const contexts = this.contextContainer.getContexts();

    if (awaitId) {
      await this.asyncRequestService.getResponse(awaitId);
    }

    return {
      clsId: this.cls.getId(),
      context: {
        id: this.context.getId(),
        ...this.context.getAll(),
      },
      contexts: Object.keys(contexts),
    };
  }
}
