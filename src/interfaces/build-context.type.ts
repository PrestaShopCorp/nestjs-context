import { ClassProvider } from '@nestjs/common';
import { ProviderInterface } from './provider.interface';
import { ExecutionContext } from './execution-context.enum';
import { HttpContextProperty } from './http-context-property.enum';

export type BuildContextFromValueType = string | number;
export type BuildContextFromCallbackType = (req?: any) => any;
export type BuildContextFromProviderType = ClassProvider<ProviderInterface>['useClass'];
export type BuildContextFromHttpRequestType = `${
  | HttpContextProperty.BODY
  | HttpContextProperty.QUERY
  | HttpContextProperty.HEADERS
  | HttpContextProperty.PARAMS}.${string}`;
export type BuildFromGqlRequestType = 'string'; // TODO JDM make it work

export type BuildContextDefinitionType<T extends ExecutionContext> =
  | BuildContextFromValueType
  | BuildContextFromCallbackType
  | BuildContextFromProviderType
  | (T extends ExecutionContext.HTTP
      ? BuildContextFromHttpRequestType
      : T extends ExecutionContext.GQL
      ? BuildFromGqlRequestType
      : never);
export type BuildContextType<T extends ExecutionContext> = Record<
  string,
  BuildContextDefinitionType<T>[]
>;
