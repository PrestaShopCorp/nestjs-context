import { merge } from 'lodash';
import {
  buildDtoDefaultOptions,
  buildDtoFactory,
  buildDtoFullOptions,
} from './build-dto.decorator';
import { ContextName } from '../interfaces';

describe('@BuildDto', () => {
  const fullOptions = {
    target: {},
    type: ContextName.HTTP,
    build: {},
  };
  it('accepts as argument both context-build like definition or a full build-dto definition', () => {
    expect(buildDtoFullOptions({})).toStrictEqual({
      type: ContextName.HTTP,
      build: {},
    });
    expect(buildDtoFullOptions({ target: {}, build: {} })).toStrictEqual({
      target: {},
      type: ContextName.HTTP,
      build: {},
    });
    expect(buildDtoFullOptions(fullOptions)).toStrictEqual(fullOptions);
  });
  it('adds some default options and calls the dto-builder tool', () => {
    const builder = jest.fn((args: any) => 'ok');
    buildDtoFactory(fullOptions, {}, builder);
    expect(builder).toHaveBeenCalledWith(
      merge(buildDtoDefaultOptions(fullOptions.type), fullOptions),
      {},
    );
  });
});
