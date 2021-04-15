import { BuildContextDefinitionType, ExecutionContext } from '../interfaces';

export const isGqlRequestContextDefinition = (
  definition,
): definition is BuildContextDefinitionType<ExecutionContext.GQL> => {
  // TODO JDM make this work
  return typeof definition === 'string' && definition.startsWith('req.');
};
