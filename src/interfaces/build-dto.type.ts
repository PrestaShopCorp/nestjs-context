import { ContextConfigType } from './context-config.type';
import { OptionalType } from './optional.type';

export type BuildDtoType = OptionalType<ContextConfigType, 'build'> & {
  target?: any;
  auto?: {
    enabled: boolean;
    prefix?: string;
    path?: string; // path to look for the elements in the request
    blocklist?: string[];
  };
};
