import { Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BuildDto } from '../../../src';
import { ExampleCommand } from './example.command';
import { ExampleDto } from '../../http/src/example.dto';

@Controller()
export class ExampleController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/example-1')
  async example1(
    @BuildDto({ dto_id: ['req.body.id'] }) command: ExampleCommand,
  ) {
    return await this.commandBus.execute(command);
  }
  @Post('/example-2')
  async example2(
    @BuildDto({
      target: ExampleDto,
      build: { dto_id: ['req.body.id'] },
      auto: { enabled: true, blocklist: ['dto_id'] },
    })
    command: ExampleCommand,
  ) {
    return await this.commandBus.execute(command);
  }

  @Post('/example-3')
  async example3(
    @BuildDto({
      target: ExampleDto,
      build: { dto_id: ['req.body.id'], code: ['req.query.code'] },
      auto: { enabled: true },
    })
    command: ExampleCommand,
  ) {
    return await this.commandBus.execute(command);
  }
}
