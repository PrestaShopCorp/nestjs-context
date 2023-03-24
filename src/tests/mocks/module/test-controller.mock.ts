/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Param } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Context } from '../../../context';
import { ContextResponseInterface } from '../../interfaces/context-response.interface';
import { AsyncRequestServiceExposer } from '../exposers/async-request-service-exposer.mock';
import { ContextContainerExposer } from '../exposers/context-container-exposer.mock';

@Controller('test-http-request')
export class TestController {
  constructor(
    private readonly cls: ClsService,
    private readonly context: Context,
    private readonly contextContainer: ContextContainerExposer,
    private readonly asyncRequestService: AsyncRequestServiceExposer,
  ) {}

  @Get(':awaitId?')
  async testHttpRequest(
    @Param('awaitId') awaitId?: string,
  ): Promise<ContextResponseInterface> {
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
