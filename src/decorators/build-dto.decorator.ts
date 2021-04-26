import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { addAutomaticBuild } from '../tools';
import { Context, getContextRequest } from '../context';
import { BuildDtoType, ContextName } from '../interfaces';

type FullOptions = BuildDtoType;
type EasyOptions = BuildDtoType['build'];
type BuildDtoOptions = FullOptions | EasyOptions;

const hasEasyOptions = (args: BuildDtoOptions): args is EasyOptions => {
  return !args.build;
};

export const buildDtoFactory = (
  options: BuildDtoType,
  request: any,
  addAuto = addAutomaticBuild,
) => {
  const { target, auto = { enabled: false }, build = {} } = options;
  const { enabled: isAuto = false } = auto;
  return new Context(
    isAuto && !!target ? addAuto(build, options) : build,
    request,
  ).getAll();
};

export const buildDtoFullOptions = (options: BuildDtoOptions): BuildDtoType => {
  const type = options.type ?? ContextName.HTTP;
  return hasEasyOptions(options)
    ? ({ type, build: options } as FullOptions)
    : { type, ...options };
};

export const BuildDto = createParamDecorator<BuildDtoOptions>(
  (options: BuildDtoOptions, ctx: ExecutionContext) => {
    const fullOptions = buildDtoFullOptions(options);
    return buildDtoFactory(
      fullOptions,
      getContextRequest(fullOptions.type, ctx),
    );
  },
);
