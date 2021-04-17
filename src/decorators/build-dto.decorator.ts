import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { merge } from 'lodash';
import { buildDto } from '../tools';
import {
  BuildDtoType,
  ContextName,
  HttpContextRequestProperty,
  OptionalType,
} from '../interfaces';

type BuildHttpDtoFullOptions = OptionalType<BuildDtoType, 'type'>;
type BuildHttpDtoOptions = BuildHttpDtoFullOptions | BuildDtoType['build'];

const isFullOptions = (
  args: BuildHttpDtoOptions,
): args is BuildHttpDtoFullOptions => {
  return !!args.target;
};

const defaultAutoPath = {
  [ContextName.HTTP]: HttpContextRequestProperty.BODY,
  [ContextName.GQL]: '',
  [ContextName.RPC]: '',
};

export const BuildDto = createParamDecorator(
  (args: BuildHttpDtoOptions, ctx: ExecutionContext) => {
    // build full args (with target) from given args
    const fullArgs = isFullOptions(args) ? args : { build: args, target: {} };

    // add defaults
    const type = fullArgs.type ?? ContextName.HTTP;
    const path = defaultAutoPath[type];
    const options = merge({ auto: { enabled: false, type, path } }, fullArgs);

    return buildDto(options, ctx.switchToHttp().getRequest());
  },
);
