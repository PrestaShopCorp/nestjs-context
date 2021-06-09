import { Injectable } from '@nestjs/common';
import { Context } from '../../../../src';

@Injectable()
export class ExampleProvider {
  constructor(private readonly ctx: Context) {}

  getAll() {
    return this.ctx.getAll();
  }
}
