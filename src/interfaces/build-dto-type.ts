import { ConfigType } from './config.type';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type BuildDtoType = Optional<ConfigType, 'build'> & {
  target: any;
  path?: string;
  auto?: {
    enabled: boolean;
    path?: string;
  };
};
