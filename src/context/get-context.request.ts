import { ExecutionContext } from '@nestjs/common';
import { ContextName } from '../interfaces';

export const getContextRequest = (type: ContextName, ctx: ExecutionContext) => {
  const mapping = {
    [ContextName.HTTP]: ctx.switchToHttp().getRequest,
    // TODO JDM how to work with GQL (subscriptions vs query and mutations)
    [ContextName.GQL_HTTP]: ctx.switchToHttp().getRequest,
    [ContextName.GQL_WS]: ctx.switchToWs().getData,
    [ContextName.WS]: ctx.switchToWs().getData,
    [ContextName.RPC]: ctx.switchToRpc().getData, // TODO jdm getContext ???
  };

  return mapping[type]();
};
