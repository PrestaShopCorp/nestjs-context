import { ContextName, HttpContextRequestProperty } from '../interfaces';

export const getContextDefaultAutoBuildPath = (type: ContextName) => {
  const defaults = {
    [ContextName.HTTP]: HttpContextRequestProperty.BODY,
    [ContextName.GQL]: '',
    [ContextName.RPC]: '',
    [ContextName.WS]: '',
  };
  return defaults[type];
};
