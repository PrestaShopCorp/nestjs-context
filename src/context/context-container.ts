/* eslint-disable @typescript-eslint/no-unused-vars */
import { Context } from './context';
import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CONTEXT_MODULE_CONFIG, HEADER_REQUEST_ID } from '../constants';
import { ContextConfigType, RequestType } from '../interfaces';
import { ClsService } from 'nestjs-cls';
import { UseClsTeardown } from '../decorators/use-cls-teardown.decorator';

const teardown: (
  this: ContextContainer,
  contextContainer: ContextContainer,
  request: RequestType,
) => void | Promise<void> = function (contextContainer, request) {
  console.log('this : ', this);
  contextContainer.remove();
};

@Injectable()
export class ContextContainer {
  private contexts: Record<string, Context> = {};

  constructor(
    @Inject(CONTEXT_MODULE_CONFIG) private readonly config: ContextConfigType,
    private readonly cls: ClsService,
    private readonly moduleRef?: ModuleRef,
  ) {}

  static getId(request: RequestType): string {
    if (!!request.headers) {
      return request.headers[HEADER_REQUEST_ID] as string;
    }

    return request[HEADER_REQUEST_ID];
  }

  current(): Context {
    const id = this.cls.getId();
    const request: RequestType = {
      [HEADER_REQUEST_ID]: id,
    };

    if (!this.contexts[id]) {
      this.addWithTeardown(this, request);
    }

    return this.contexts[id];
  }

  get(): Context {
    const id = this.cls.getId();

    return this.contexts[id] ?? null;
  }

  add(request: RequestType): Context {
    const id = this.cls.getId() ?? ContextContainer.getId(request);
    this.contexts[id] = new Context(id, this.config, request, this.moduleRef);

    return this.contexts[id];
  }

  @UseClsTeardown({
    generateId: false,
    teardown,
  })
  async addWithTeardown(
    contextContainer: ContextContainer,
    request: RequestType,
  ): Promise<Context> {
    return this.add(request);
  }

  remove(): void {
    const id = this.cls.getId();

    delete this.contexts[id];
  }
}
