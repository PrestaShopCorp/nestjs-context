import { Context } from './context';
import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CONTEXT_MODULE_CONFIG, HEADER_REQUEST_ID } from '../constants';
import { ContextConfigType, RequestType } from '../interfaces';
import { generateId } from '../tools';

@Injectable()
export class ContextContainer {
  private contexts: Record<string, Context> = {};

  constructor(
    @Inject(CONTEXT_MODULE_CONFIG) private readonly config: ContextConfigType,
    private readonly moduleRef?: ModuleRef,
  ) {}

  static getId(request: RequestType): string {
    if (!!request.headers) {
      return request.headers[HEADER_REQUEST_ID] as string;
    }
    return request[HEADER_REQUEST_ID];
  }

  createContextFromRequest(request: RequestType) {
    const contextId = ContextContainer.getId(request);

    return new Context(contextId, this.config, request, this.moduleRef);
  }

  createNonHttpContext() {
    const contextId = generateId();
    const emptyRequest: RequestType = {
      [HEADER_REQUEST_ID]: contextId,
    };

    return new Context(contextId, this.config, emptyRequest, this.moduleRef);
  }

  createAndAddContextFromRequest(request: RequestType) {
    const context = this.createContextFromRequest(request);
    this.addContext(context);
  }

  addContext(context: Context) {
    this.contexts[context.getId()] = context;
  }

  getContextFromId(contextId: string) {
    return this.contexts[contextId] ?? null;
  }

  getContextFromRequest(request: RequestType) {
    const contextId = ContextContainer.getId(request)
    return this.getContextFromId(contextId);
  }

  removeContextFromRequest(request: RequestType) {
    const contextId = ContextContainer.getId(request);

    delete this.contexts[contextId];
  }

  getContextsSize() {
    return Object.keys(this.contexts).length;
  }
}
