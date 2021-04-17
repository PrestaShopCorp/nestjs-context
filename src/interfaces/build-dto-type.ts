import { ConfigType } from './config.type';
import { OptionalType } from './optional.type';

export type BuildDtoType = OptionalType<ConfigType, 'build'> & {
  target: any;
  auto?: {
    enabled: boolean;
    path?: string;
  };
};
