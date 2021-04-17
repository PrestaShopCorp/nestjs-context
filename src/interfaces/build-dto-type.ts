import { ConfigType } from './config.type';
import { OptionalType } from './optional.type';

export type BuildDtoType = OptionalType<ConfigType, 'build'> & {
  target: any;
  auto?: {
    enabled: boolean;
    path?: string; // path to look for the elements in the request
    is_fallback?: boolean; // auto-build declared in "build" as fallback for the build
  };
};
