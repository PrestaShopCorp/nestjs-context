/* eslint-disable @typescript-eslint/no-unused-vars */
import { Context } from './context';
import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import LRUCache from 'lru-cache';
import { CONTEXT_MODULE_CONFIG, HEADER_REQUEST_ID } from '../constants';
import { ContextConfigType, RequestType } from '../interfaces';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class ContextContainer {
  private contexts: Record<string, Context> = {};
  private cache: LRUCache<string, Context>;

  constructor(
    @Inject(CONTEXT_MODULE_CONFIG) private readonly config: ContextConfigType,
    private readonly cls: ClsService,
    private readonly moduleRef?: ModuleRef,
  ) {
    this.cache = new LRUCache(config.lruCache || { max: 500 });
  }

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

    return this.get() ?? this.add(request);
  }

  get(): Context {
    const id = this.cls.getId();

    return this.contexts[id] ?? (this.cache.get(id) || null);
  }

  add(request: RequestType): Context {
    const id = this.cls.getId() ?? ContextContainer.getId(request);
    const context = new Context(id, this.config, request, this.moduleRef);

    if (request.protocol !== undefined) {
      this.contexts[id] = context;
    } else {
      this.cache.set(id, context);
    }

    return context;
  }

  remove(): void {
    const id = this.cls.getId();

    delete this.contexts[id];
  }
}
