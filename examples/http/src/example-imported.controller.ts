import { Controller, Logger, Post } from '@nestjs/common';
import { Context } from '../../../src';

@Controller()
export class ExampleImportedController {
  private logger = new Logger();

  constructor(private readonly ctx: Context) {}

  @Post('/example-4')
  async example4() {
    this.logger.log(this.ctx.getAll());
    return 'ok';
  }
}
