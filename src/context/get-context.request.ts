import { ExecutionContext } from '@nestjs/common';
import { ContextName } from '../interfaces';

export const getContextRequest = (type: ContextName, ctx: ExecutionContext) => {
  const mapping = {
    [ContextName.HTTP]: ctx.switchToHttp().getResponse,
    [ContextName.GQL]: ctx.switchToHttp().getRequest,
    [ContextName.WS]: ctx.switchToWs().getData,
    [ContextName.RPC]: ctx.switchToRpc().getData,
  };

  return mapping[type]();
};
