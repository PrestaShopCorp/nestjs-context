import { Context } from './context';
import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CONTEXT_MODULE_CONFIG, HEADER_REQUEST_ID } from '../constants';
import { ContextConfigType, RequestType } from '../interfaces';
// import { generateId } from '../tools';
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

  // private getCurrentId() {
  //   return this.contextStack[this.contextStack.length - 1];
  // }

  current() {
    /// @todo jdm : this should return null as fallback and we should be using create-context decorators instead
    // const request: RequestType = {
    //   [HEADER_REQUEST_ID]: generateId(),
    // };
    const id = this.cls.getId();
    const request: RequestType = {
      [HEADER_REQUEST_ID]: id,
    };
    // console.log('request : ', this.request);
    if (this.contexts[id]) {
      console.log('current context found : ', {
        id: this.contexts[id].getId(),
        baseUrl: this.contexts[id].request.baseUrl,
        body: this.contexts[id].request.body,
        correlationId: this.contexts[id].getCachedValue('correlation_id'),
      });
    } else {
      console.log('current context not found');
    }

    return this.contextStack.length && this.contexts[id]
      ? this.contexts[id]
      : this.add(request);
    // return this.contextStack.length
    //   ? this.contexts[this.getCurrentId()]
    //   : this.add(request);
  }

  get(request: RequestType) {
    const id = this.cls.getId();
    console.log('request ID CLS : ', id);
    if (this.contexts[id]) {
      console.log('get context found : ', {
        id: this.contexts[id].getId(),
        baseUrl: this.contexts[id].request.baseUrl,
        body: this.contexts[id].request.body,
        correlationId: this.contexts[id].getCachedValue('correlation_id'),
      });
    } else {
      console.log('get context not found');
    }

    return this.contexts[id] ?? null;
    // return this.contexts[ContextContainer.getId(request)] ?? null;
  }

  add(request: RequestType) {
    // const id = ContextContainer.getId(request);
    const id = this.cls.getId();
    // if (!id) {
    //   id = ContextContainer.getId(request);
    //   const tmp = new Error();
    //   console.log(tmp.stack);
    // }
    this.contextStack.push(id);
    this.contexts[id] = new Context(id, this.config, request, this.moduleRef);

    console.log('context stack after adding : ', this.contextStack);
    console.log('context added : ', {
      id: this.contexts[id].getId(),
      baseUrl: this.contexts[id].request.baseUrl,
      body: this.contexts[id].request.body,
      correlationId: this.contexts[id].getCachedValue('correlation_id'),
    });
    // console.log('context :', this.contexts[id]);
    return this.contexts[id];
  }

  remove() {
    const id = this.cls.getId();
    const index = this.contextStack.indexOf(id);
    console.log('request ID CLS : ', id);
    // const id = ContextContainer.getId(request);
    delete this.contexts[id];
    this.contextStack.splice(index, 1);
    console.log('context removed  : ', id);
    console.log('remaining stack : ', this.contextStack);
    // delete this.contexts[ContextContainer.getId(request)];
    // this.contextStack.pop();
  }
}
