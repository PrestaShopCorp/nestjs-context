import { BuildContextType } from './build-context.type';
import { ExecutionContext } from './execution-context.enum';

export type ConfigType =
  | {
      type: ExecutionContext.HTTP;
      build: BuildContextType<ExecutionContext.HTTP>;
    }
  | {
      type: ExecutionContext.GQL;
      build: BuildContextType<ExecutionContext.GQL>;
    }
  | {
      type: ExecutionContext.RPC;
      build: BuildContextType<ExecutionContext.RPC>;
    };
