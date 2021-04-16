import { BuildContextDefinitionType, ContextName } from '../interfaces';
import { GqlContextRequestProperty } from '../interfaces';

export const isGqlContextRequestDefinition = (
  definition,
): definition is BuildContextDefinitionType<ContextName.GQL> => {
  return (
    typeof definition === 'string' &&
    Object.values(GqlContextRequestProperty).some((prop) =>
      definition.startsWith(`${prop}.`),
    )
  );
};
