import { ContextName } from './context-name.enum';
import { BuildContextType } from './build-context.type';

export type BuildHttpDtoType<T extends ContextName> = BuildContextType<T>;
