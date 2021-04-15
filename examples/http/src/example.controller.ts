import { Controller, Logger, Post } from '@nestjs/common';
import { Context } from '../../../src/context';

@Controller()
export class ExampleController {
  private logger = new Logger();
  constructor(private readonly context: Context) {}

  @Post('/example')
  async example() {
    this.logger.log(this.context.getAll());
    return 'ok';
  }
}
