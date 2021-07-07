import { Context } from './context';
import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CONTEXT_MODULE_CONFIG, HEADER_REQUEST_ID } from '../constants';
import { ContextConfigType, RequestType } from '../interfaces';
import { generateId } from '../tools';

@Injectable()
export class ContextContainer {
  private contexts: Record<string, Context> = {};
  private contextStack: string[] = [];

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
  private getCurrentId() {
    return this.contextStack[this.contextStack.length - 1];
  }
  current() {
    /// @todo jdm : this should return null as fallback and we should be using create-context decorators instead
    const request: RequestType = {
      [HEADER_REQUEST_ID]: generateId(),
    };
    return this.contextStack.length
      ? this.contexts[this.getCurrentId()]
      : this.add(request);
  }
  get(request: RequestType) {
    return this.contexts[ContextContainer.getId(request)] ?? null;
  }
  add(request: RequestType) {
    const id = ContextContainer.getId(request);
    this.contextStack.push(id);
    this.contexts[id] = new Context(id, this.config, request, this.moduleRef);
    return this.contexts[id];
  }
  remove(request: RequestType) {
    delete this.contexts[ContextContainer.getId(request)];
    this.contextStack.pop();
  }
}
