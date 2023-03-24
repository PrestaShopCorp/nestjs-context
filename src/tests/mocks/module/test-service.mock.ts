/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ClsService, UseCls } from 'nestjs-cls';
import { Context, ContextContainer } from '../../../context';
import { ContextResponse } from '../../utils/context.utils';
import { AsyncRequestServiceExposer } from '../exposers/async-request-service-exposer.mock';
import LRUCache from 'lru-cache';

@Injectable()
export class TestService {
  private cache: LRUCache<string, any>;

  constructor(
    private readonly cls: ClsService,
    private readonly context: Context,
    private readonly contextContainer: ContextContainer,
    private readonly asyncRequestService: AsyncRequestServiceExposer,
  ) {
    this.cache = new LRUCache({ max: 50 });
  }

  clearContext() {
    this.contextContainer.remove();
  }

  @UseCls({
    generateId: true,
    setup(cls, testValue) {
      cls.set('testValue', testValue);
    },
  })
  async testEmitEvent(
    testValue: string,
    awaitId?: string,
  ): Promise<ContextResponse> {
    const clsId = this.cls.getId();
    const id = this.context.getId();

    if (awaitId) {
      await this.asyncRequestService.getResponse(awaitId);
    }

    return {
      clsId,
      context: {
        id,
        ...this.context.getAll(),
        testValue: this.cls.get('testValue'),
      },
    };
  }
}
