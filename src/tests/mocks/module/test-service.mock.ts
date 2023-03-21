/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Context, ContextContainer } from '../../../context';
import { ContextResponse } from '../../utils/context.utils';
import { ContextContainerExposer } from '../exposers/context-container-exposer.mock';
import { AsyncRequestServiceExposer } from '../exposers/async-request-service-exposer.mock';
import { UseClsTeardown } from '../../../decorators/use-cls-teardown.decorator';

const teardown: (
  this: TestService,
  _testValue: string,
  _awaitId?: string,
) => void | Promise<void> = function () {
  this.clearContext();
};

@Injectable()
export class TestService {
  constructor(
    private readonly cls: ClsService,
    private readonly context: Context,
    private readonly contextContainer: ContextContainer,
    private readonly contextContainerExposer: ContextContainerExposer,
    private readonly asyncRequestService: AsyncRequestServiceExposer,
  ) {}

  clearContext() {
    this.contextContainer.remove();
  }

  @UseClsTeardown({
    generateId: true,
    setup(cls, testValue) {
      cls.set('testValue', testValue);
    },
    teardown,
  })
  async testEmitEvent(
    testValue: string,
    awaitId?: string,
  ): Promise<ContextResponse> {
    const contexts = this.contextContainerExposer.getContexts();

    if (awaitId) {
      await this.asyncRequestService.getResponse(awaitId);
    }

    return {
      clsId: this.cls.getId(),
      context: {
        id: this.context.getId(),
        ...this.context.getAll(),
        testValue: this.cls.get('testValue'),
      },
      contexts: Object.keys(contexts),
    };
  }
}
