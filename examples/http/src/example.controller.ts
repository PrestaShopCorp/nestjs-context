import { Controller, Logger, Post } from '@nestjs/common';
import {
  AddCorrelationIdDecorator,
  BuildDto,
  Context,
  CorrelationId,
} from '../../../src';
import { ExampleDto } from './example.dto';

@Controller()
@AddCorrelationIdDecorator('metadata.correlation_id')
export class ExampleController {
  private logger = new Logger();
  @CorrelationId()
  private declare readonly correlationId;
  private readonly metadata;

  constructor(private readonly ctx: Context) {}

  @Post('/example-1')
  async example1(@BuildDto({ dto_id: ['req.body.id'] }) dto: ExampleDto) {
    this.logger.log(this.correlationId);
    this.logger.log(this.metadata);
    this.logger.log(this.ctx.getAll());
    this.logger.log(JSON.stringify(dto));
    return 'ok';
  }

  @Post('/example-2')
  async example2(
    @BuildDto({
      target: ExampleDto,
      build: { dto_id: ['req.body.id'] },
      auto: { enabled: true, blocklist: ['dto_id'] },
    })
    dto: ExampleDto,
  ) {
    this.logger.log(this.correlationId);
    this.logger.log(this.metadata);
    this.logger.log(this.ctx.getAll());
    this.logger.log(JSON.stringify(dto));
    return 'ok';
  }

  @Post('/example-3')
  async example3(
    @BuildDto({
      target: ExampleDto,
      build: { dto_id: ['req.body.id'], code: ['req.query.code'] },
      auto: { enabled: true },
    })
    dto: ExampleDto,
  ) {
    this.logger.log(this.correlationId);
    this.logger.log(this.metadata);
    this.logger.log(this.ctx.getAll());
    this.logger.log(JSON.stringify(dto));
    return 'ok';
  }
}
