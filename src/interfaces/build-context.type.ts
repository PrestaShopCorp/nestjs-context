import { ClassProvider } from '@nestjs/common';
import { IContextPropertyProvider } from './context-property-provider.interface';
import { ContextName } from './context-name.enum';
import { HttpContextRequestProperty } from './http-context-request-property.enum';

export type BuildContextFromValueType = string | number;
export type BuildContextFromCallbackType = (
  req?: any,
  setValues?: Map<string | symbol, any>,
) => any;
export type BuildContextFromProviderType = ClassProvider<IContextPropertyProvider>['provide'];
export type BuildContextFromHttpRequestType = `${
  | HttpContextRequestProperty.BODY
  | HttpContextRequestProperty.QUERY
  | HttpContextRequestProperty.HEADERS
  | HttpContextRequestProperty.PARAMS}.${string}`;
export type BuildFromGqlRequestType = 'string'; // TODO JDM make it work
export type BuildContextDefinitionType<T extends ContextName> =
  | BuildContextFromValueType
  | BuildContextFromCallbackType
  | BuildContextFromProviderType
  | (T extends ContextName.HTTP
      ? BuildContextFromHttpRequestType
      : T extends ContextName.GQL_HTTP | ContextName.GQL_WS
      ? BuildFromGqlRequestType
      : never);

export type BuildContextType<T extends ContextName> = Record<
  string,
  BuildContextDefinitionType<T>[]
>;
