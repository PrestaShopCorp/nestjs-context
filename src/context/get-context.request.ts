import { ExecutionContext } from '@nestjs/common';
import { ContextName } from '../interfaces';

export const getContextRequest = (type: ContextName, ctx: ExecutionContext) => {
  const mapping = {
    [ContextName.HTTP]: ctx.switchToHttp().getRequest,
    [ContextName.GQL]: ctx.switchToWs().getData,
    [ContextName.WS]: ctx.switchToWs().getData,
    [ContextName.RPC]: ctx.switchToRpc().getData,
  };

  return mapping[type]();
};
