/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { ContextType } from '../utils/context.utils';

@ObjectType()
export class Context implements ContextType {
  @IsString()
  @Field()
  id: string;

  @IsString()
  @Field()
  request_id: string;

  @IsString()
  @Field()
  correlation_id: string;

  @IsString()
  @Field()
  platform: string;

  @IsString()
  @Field()
  hostname: string;

  @IsString()
  @Field()
  bin: string;

  @IsString()
  @Field()
  path: string;

  @IsString()
  @Field()
  protocol: string;

  @IsString()
  @Field()
  testValue: string;
}
