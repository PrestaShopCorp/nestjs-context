import { Controller, Logger, Post } from '@nestjs/common';
import { BuildHttpDto, Context } from '../../../src';
import { ExampleDto } from './example.dto';

@Controller()
export class ExampleController {
  private logger = new Logger();
  constructor(private readonly context: Context) {}

  @Post('/example')
  async example1(@BuildHttpDto({ dto_id: ['body.id'] }) dto: ExampleDto) {
    this.logger.log(this.context.getAll());
    this.logger.log(JSON.stringify(dto));
    return 'ok';
  }

  @Post('/example-2')
  async example2(
    @BuildHttpDto({
      target: ExampleDto,
      build: { dto_id: ['body.id'] },
      auto: { enabled: true },
    })
    dto: ExampleDto,
  ) {
    this.logger.log(this.context.getAll());
    this.logger.log(JSON.stringify(dto));
    return 'ok';
  }
}
