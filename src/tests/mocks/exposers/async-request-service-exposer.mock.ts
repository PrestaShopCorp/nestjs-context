/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AsyncRequestServiceExposer {
  private promise = {};
  public resolve = {};

  getResponse(awaitId: string) {
    return null;
  }
}
