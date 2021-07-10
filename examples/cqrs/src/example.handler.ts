import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ExampleCommand } from './example.command';
import { ExampleService } from './example.service';
import { ContextAware, CorrelationId } from '../../../src';

@CommandHandler(ExampleCommand)
@ContextAware()
export class ExampleHandler implements ICommandHandler<ExampleCommand> {
  @CorrelationId()
  private declare readonly correlationId;
  constructor(private readonly service: ExampleService) {}
  async execute(command: ExampleCommand) {
    console.log(`Reading correlation-id from context: ${this.correlationId}`);
    this.service.log();
    return command;
  }
}
