import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddCorrelationId, Context, CorrelationId } from '../../../src';
import { ExampleCommand } from './example.command';

@AddCorrelationId('metadata.correlation_id')
@CommandHandler(ExampleCommand)
export class ExampleHandler implements ICommandHandler<ExampleCommand> {
  @CorrelationId()
  private declare readonly correlationId;
  private readonly metadata;
  constructor(private readonly context: Context) {}
  async execute(command: ExampleCommand) {
    // console.log(this.correlationId);
    // console.log(this.metadata);
    // console.log(this.context.getAll());
    return command;
  }
}
