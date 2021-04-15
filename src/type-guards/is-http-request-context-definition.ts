import {
  BuildContextDefinitionType,
  ExecutionContext,
  HttpContextProperty,
} from '../interfaces';

export const isHttpRequestContextDefinition = (
  definition,
): definition is BuildContextDefinitionType<ExecutionContext.HTTP> => {
  return (
    typeof definition === 'string' &&
    Object.values(HttpContextProperty).some((prop) =>
      definition.startsWith(`${prop}.`),
    )
  );
};
