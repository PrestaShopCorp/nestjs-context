import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { merge } from 'lodash';
import { buildDto } from '../tools';
import {
  BuildDtoType,
  ContextName,
  HttpContextRequestProperty,
} from '../interfaces';

type BuildHttpDtoFullOptions = Omit<BuildDtoType, 'type'>;
type BuildHttpDtoOptions = BuildHttpDtoFullOptions | BuildDtoType['build'];

const isFullOptions = (
  args: BuildHttpDtoOptions,
): args is BuildHttpDtoFullOptions => {
  return !!args.target;
};
export const BuildHttpDto = createParamDecorator(
  (args: BuildHttpDtoOptions, ctx: ExecutionContext) => {
    // build full args (with target) from given args
    const fullArgs = isFullOptions(args) ? args : { build: args, target: {} };

    // add defaults and context type
    const options = merge(
      { auto: { enabled: false, path: HttpContextRequestProperty.BODY } },
      { ...fullArgs, type: ContextName.HTTP },
    );
    return buildDto(options, ctx.switchToHttp().getRequest());
  },
);
