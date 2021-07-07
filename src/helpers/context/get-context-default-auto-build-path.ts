import { ContextName, HttpContextRequestProperty } from '../../interfaces';

export const getContextDefaultAutoBuildPath = (type: ContextName) => {
  const defaults = {
    [ContextName.HTTP]: HttpContextRequestProperty.BODY,
    [ContextName.GQL_HTTP]: '',
    [ContextName.GQL_WS]: '',
    [ContextName.RPC]: '',
    [ContextName.WS]: '',
  };
  return defaults[type];
};
