import { getContextDefaultAutoBuildPath } from './get-context-default-auto-build-path';
import { ContextName, HttpContextRequestProperty } from '../interfaces';

describe('getContextDefaultAutoBuildPath', () => {
  it(`gets ${HttpContextRequestProperty.BODY} as default for ${ContextName.HTTP} context`, () => {
    expect(getContextDefaultAutoBuildPath(ContextName.HTTP)).toBe(
      HttpContextRequestProperty.BODY,
    );
  });
});
