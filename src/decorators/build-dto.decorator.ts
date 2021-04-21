import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { merge } from 'lodash';
import { dtoBuilder } from '../tools';
import { getContextDefaultAutoBuildPath, getContextRequest } from '../context';
import { BuildDtoType, ContextName, OptionalType } from '../interfaces';

type BuildDtoFullOptions = OptionalType<BuildDtoType, 'type'>;
type BuildDtoOptions = BuildDtoFullOptions | BuildDtoType['build'];

const isFullOptions = (args: BuildDtoOptions): args is BuildDtoFullOptions => {
  return !!args.build;
};

export const buildDtoDefaultOptions = (type: ContextName) => ({
  target: {},
  auto: {
    enabled: false,
    is_fallback: false,
    path: getContextDefaultAutoBuildPath(type),
  },
});

export const buildDtoFactory = (
  options: BuildDtoFullOptions,
  request: any,
  builder = dtoBuilder,
) => {
  const optionsWithDefaults: BuildDtoType = merge(
    buildDtoDefaultOptions(options.type),
    options,
  );
  return builder(optionsWithDefaults, request);
};

export const buildDtoFullOptions = (
  options: BuildDtoOptions,
): BuildDtoFullOptions => {
  const type =
    isFullOptions(options) && !!options.type ? options.type : ContextName.HTTP;
  return isFullOptions(options)
    ? options
    : ({ type, build: options } as BuildDtoFullOptions);
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
