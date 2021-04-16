import { BuildContextType } from './build-context.type';
import { ContextName } from './context-name.enum';

export type ConfigType =
  | {
      type: ContextName.HTTP;
      build: BuildContextType<ContextName.HTTP>;
    }
  | {
      type: ContextName.GQL;
      build: BuildContextType<ContextName.GQL>;
    }
  | {
      type: ContextName.RPC;
      build: BuildContextType<ContextName.RPC>;
    };
