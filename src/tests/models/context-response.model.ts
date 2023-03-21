/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ObjectType } from '@nestjs/graphql';
import { ContextResponseInterface } from '../interfaces/context-response.interface';
import { Context } from './context.model';

@ObjectType()
export class ContextResponse implements ContextResponseInterface {
  @Field()
  clsId: string;

  @Field((type) => Context)
  context: Context;

  @Field((type) => [String])
  contexts: Array<string>;
}
