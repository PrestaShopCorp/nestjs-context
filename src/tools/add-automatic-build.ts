import { get, merge, omit } from 'lodash';
import { BuildDtoType } from '../interfaces';
import { getContextDefaultAutoBuildPath } from '../context';

const getContextPropertyCallback = (path) => (request) => get(request, path);

/**
 * Returns context properties build for target from path
 * @param target
 * @param path
 * @param contextPropertyCallback
 */
const getContextPropertiesBuildFromRequestPath = (
  target: any,
  path?: string,
  contextPropertyCallback = getContextPropertyCallback,
) => {
  const autoBuildEntries = Object.getOwnPropertyNames(new target()).map(
    (property) => {
      return [
        property,
        [contextPropertyCallback(`${path ? `${path}.` : ''}${property}`)],
      ];
    },
  );
  return Object.fromEntries(autoBuildEntries);
};

/**
 * ATTENTION:
 *    If you want to use this functionality you have to configure tsconfig with
 *    useDefineForClassFields: true or strictPropertyInitialization: true.
 *    If not, any declared and not initialised property in your DTO
 *    won't be taken into account when building the DTO
 *
 * @param build
 * @param options
 * @constructor
 */
export const addAutomaticBuild = (
  build: BuildDtoType['build'],
  options: Omit<BuildDtoType, 'build'>,
) => {
  // add options defaults
  const optionsWithDefaults = merge(
    {
      target: {},
      auto: {
        enabled: false,
        blocklist: false,
        path: getContextDefaultAutoBuildPath(options.type),
        prefix: '',
      },
    },
    options,
  );
  const { target, auto } = optionsWithDefaults;
  const { enabled, blocklist, path, prefix } = auto;

  if (!!enabled && !!target) {
    const autoBuilt = getContextPropertiesBuildFromRequestPath(
      target,
      path.replace(/^req./, ''), // remove initial req. if any
    );
    const keysToMerge = Object.keys(
      !!blocklist ? omit(autoBuilt, blocklist) : autoBuilt,
    );
    for (const key of keysToMerge) {
      build[!!prefix ? `${prefix}.${key}` : key] = [
        ...autoBuilt[key],
        ...(build[key] || []),
      ];
    }
  }

  return build;
};
