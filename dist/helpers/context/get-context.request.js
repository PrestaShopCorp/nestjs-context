"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContextRequest = void 0;
const interfaces_1 = require("../../interfaces");
const getContextRequest = (type, ctx) => {
    const mapping = {
        [interfaces_1.ContextName.HTTP]: ctx.switchToHttp().getRequest,
        [interfaces_1.ContextName.GQL_HTTP]: ctx.switchToHttp().getRequest,
        [interfaces_1.ContextName.GQL_WS]: ctx.switchToWs().getData,
        [interfaces_1.ContextName.WS]: ctx.switchToWs().getData,
        [interfaces_1.ContextName.RPC]: ctx.switchToRpc().getData,
    };
    return mapping[type]();
};
exports.getContextRequest = getContextRequest;
//# sourceMappingURL=get-context.request.js.map