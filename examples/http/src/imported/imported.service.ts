import { Injectable } from '@nestjs/common';

@Injectable()
export class ImportedService {
  debug() {
    console.log('imported debug !');
  }
}
