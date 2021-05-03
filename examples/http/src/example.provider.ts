import { Injectable } from '@nestjs/common';
import { Context } from 'nestjs-context';

@Injectable()
export class ExampleProvider {
  constructor(private readonly ctx: Context) {}

  getAll() {
    return this.ctx.getAll();
  }
}
