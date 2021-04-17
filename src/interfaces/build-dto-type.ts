import { ConfigType } from './config.type';
import { OptionalType } from './optional.type';

export type BuildDtoType = OptionalType<ConfigType, 'build'> & {
  target: any;
  path?: string;
  auto?: {
    enabled: boolean;
    path?: string;
  };
};
