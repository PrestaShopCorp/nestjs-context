import { DynamicModule } from '@nestjs/common';
import { ContextConfigType } from './interfaces';
import { createContextModule } from './context.module';

export const convertToContextModule: (
  convert: Partial<DynamicModule>,
  config: ContextConfigType,
) => DynamicModule = (convert, config) => {
  const { providers, exports, module, global } = createContextModule(config);
  return {
    ...convert,
    providers: [...convert.providers, ...providers],
    exports: [...convert.providers, ...exports],
    global,
    module,
  };
};
