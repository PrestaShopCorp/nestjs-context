import { getContextDefaultAutoBuildPath } from './get-context-default-auto-build-path';
import { ContextName, HttpContextRequestProperty } from '../interfaces';

describe('getContextDefaultAutoBuildPath', () => {
  it(`gets ${HttpContextRequestProperty.BODY} as default for ${ContextName.HTTP} context`, () => {
    expect(getContextDefaultAutoBuildPath(ContextName.HTTP)).toBe(
      HttpContextRequestProperty.BODY,
    );
  });
  it(`gets '' as default for ${ContextName.WS} context`, () => {
    expect(getContextDefaultAutoBuildPath(ContextName.WS)).toBe('');
  });
  it(`gets '' as default for ${ContextName.RPC} context`, () => {
    expect(getContextDefaultAutoBuildPath(ContextName.RPC)).toBe('');
  });
  it(`gets '' as default for ${ContextName.GQL} context`, () => {
    expect(getContextDefaultAutoBuildPath(ContextName.GQL)).toBe('');
  });
});
