import { Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BuildDto } from '../../../src';
import { ExampleCommand } from './example.command';

@Controller()
export class ExampleController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/example-1')
  async example1(
    @BuildDto({ dto_id: ['req.body.id'] }) command: ExampleCommand,
  ) {
    return await this.commandBus.execute(command);
  }
}
