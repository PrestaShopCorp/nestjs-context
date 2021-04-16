import {
  BuildContextDefinitionType,
  ContextName,
  HttpContextRequestProperty,
} from '../interfaces';

export const isHttpContextRequestDefinition = (
  definition,
): definition is BuildContextDefinitionType<ContextName.HTTP> => {
  return (
    typeof definition === 'string' &&
    Object.values(HttpContextRequestProperty).some((prop) =>
      definition.startsWith(`${prop}.`),
    )
  );
};
