import { ContextConfigType } from './context-config.type';

export type BuildDtoType = Partial<
  Pick<ContextConfigType, 'build' | 'type'>
> & {
  target?: any;
  auto?: {
    enabled: boolean;
    prefix?: string;
    path?: string; // path to look for the elements in the request
    blocklist?: string[];
  };
};
