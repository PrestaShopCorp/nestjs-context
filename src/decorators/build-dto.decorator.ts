import { uuid } from 'short-uuid';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { omit } from 'lodash';
import { addAutomaticBuild } from '../tools';
import { Context, ContextContainer } from '../context';
import { BuildDtoType, ContextConfigType, ContextName } from '../interfaces';
import { getContextRequest } from '../helpers';
type EasyOptions = BuildDtoType['build'];
type BuildDtoDecoratorOptions = BuildDtoType | EasyOptions;

const hasEasyOptions = (
  args: BuildDtoDecoratorOptions,
): args is EasyOptions => {
  return !args.build;
};

export const buildDtoFactory = (
  options: BuildDtoType,
  request: any,
  addAuto = addAutomaticBuild,
) => {
  const { target, auto = { enabled: false }, build = {} } = options;
  const { enabled: isAuto = false } = auto;
  const config: ContextConfigType = {
    ...omit(options, ['target', 'auto']),
    build: isAuto && !!target ? addAuto(build, options) : build,
  };
  return new Context(
    `build-dto-${ContextContainer.getId(request)}-${uuid()}`,
    config,
    request,
  ).getAll();
};

export const buildDtoFullOptions = (
  options: BuildDtoDecoratorOptions,
): BuildDtoType => {
  const type = options.type ?? ContextName.HTTP;
  return hasEasyOptions(options)
    ? ({ type, build: options } as BuildDtoType)
    : ({ ...options, type, build: options?.build ?? {} } as BuildDtoType);
};

export const BuildDto = createParamDecorator<BuildDtoDecoratorOptions>(
  (options: BuildDtoDecoratorOptions, ctx: ExecutionContext) => {
    const fullOptions = buildDtoFullOptions(options);
    return buildDtoFactory(
      fullOptions,
      getContextRequest(fullOptions.type, ctx),
    );
  },
);
