import { Injectable } from '@nestjs/common';
import { AddCorrelationId } from '../../../src';

@Injectable()
@AddCorrelationId('metadata.correlation_id')
export class ExampleService {
  private readonly metadata;
  log() {
    console.log('Metadata loaded without injection', this.metadata);
  }
}
