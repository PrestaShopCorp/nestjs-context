import { get } from 'lodash';
import { BuildContextFromCallbackType, BuildDtoType } from '../interfaces';
import { Context } from '../context';

const autoBuildDtoPropertyCallback = (path: string) => (
  req: Record<string, any>,
) => {
  return get(req, path);
};

const autoBuild = (target: any, path?: string) => {
  const autoBuildPath = path ? `${path}.` : '';
  const autoBuildEntries: [
    string,
    [BuildContextFromCallbackType],
  ][] = Object.getOwnPropertyNames(new target()).map((property) => {
    return [
      property,
      [autoBuildDtoPropertyCallback(`${autoBuildPath}${property}`)],
    ];
  });
  return Object.fromEntries(autoBuildEntries);
};

/**
 * ATTENTION:
 *    If you want to use the auto-build option of this decorator
 *    (disabled by default) you have to configure tsconfig with
 *    useDefineForClassFields: true or strictPropertyInitialization: true.
 *    If not, any declared and not initialised property in your DTO
 *    won't be taken into account when building the DTO
 *
 * @param options
 * @param request
 * @constructor
 */
export const buildDto = (options: BuildDtoType, request: any) => {
  // add defaults
  options = {
    build: {},
    auto: {
      enabled: false,
    },
    ...options,
  };
  // build the dto
  const { type, target, auto } = options;
  let { build } = options;
  if (auto?.enabled) {
    build = { ...autoBuild(target, auto.path), ...build };
  }
  return new Context({ type, build }, request).getAll();
};
