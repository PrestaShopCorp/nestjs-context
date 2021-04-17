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
  return !!args.build;
};

const defaultAutoPath = {
  [ContextName.HTTP]: HttpContextRequestProperty.BODY,
  [ContextName.GQL]: '',
  [ContextName.RPC]: '',
};

export const BuildDto = createParamDecorator<BuildHttpDtoOptions>(
  (args: BuildHttpDtoOptions, ctx: ExecutionContext) => {
    // build full args with type from given args
    const type =
      isFullOptions(args) && !!args.type ? args.type : ContextName.HTTP;
    const fullArgs = isFullOptions(args)
      ? args
      : ({ build: args, type } as BuildHttpDtoFullOptions);

    // add defaults
    const options: BuildDtoType = merge(
      {
        target: {},
        auto: {
          enabled: false,
          is_fallback: false,
          path: defaultAutoPath[type],
        },
      },
      fullArgs,
    );

    return buildDto(options, ctx.switchToHttp().getRequest());
  },
);
