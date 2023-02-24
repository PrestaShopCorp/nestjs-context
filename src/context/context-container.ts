import { Context } from './context';
import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CONTEXT_MODULE_CONFIG, HEADER_REQUEST_ID } from '../constants';
import { ContextConfigType, RequestType } from '../interfaces';
import { generateId } from '../tools';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class ContextContainer {
  private contexts: Record<string, Context> = {};
  private contextStack: string[] = [];

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

  current() {
    const id = this.cls.getId() ?? generateId();
    const request: RequestType = {
      [HEADER_REQUEST_ID]: id,
    };

    return this.contextStack.length && this.contexts[id]
      ? this.contexts[id]
      : this.add(request);
  }

  get(request: RequestType) {
    const id = this.cls.getId();

    return this.contexts[id] ?? null;
  }

  add(request: RequestType) {
    const id = this.cls.getId() ?? ContextContainer.getId(request);
    this.contexts[id] = new Context(id, this.config, request, this.moduleRef);

    this.contextStack.push(id);

    return this.contexts[id];
  }

  remove() {
    const id = this.cls.getId();
    const index = this.contextStack.indexOf(id);

    delete this.contexts[id];
    this.contextStack.splice(index, 1);
  }
}
