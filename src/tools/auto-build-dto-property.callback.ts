import { get } from 'lodash';

export const autoBuildDtoPropertyCallback = (path: string) => (
  req: Record<string, any>,
) => {
  return get(req, path);
};
