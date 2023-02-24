"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContextDefaultAutoBuildPath = void 0;
const interfaces_1 = require("../../interfaces");
const getContextDefaultAutoBuildPath = (type) => {
    const defaults = {
        [interfaces_1.ContextName.HTTP]: interfaces_1.HttpContextRequestProperty.BODY,
        [interfaces_1.ContextName.GQL_HTTP]: '',
        [interfaces_1.ContextName.GQL_WS]: '',
        [interfaces_1.ContextName.RPC]: '',
        [interfaces_1.ContextName.WS]: '',
    };
    return defaults[type];
};
exports.getContextDefaultAutoBuildPath = getContextDefaultAutoBuildPath;
//# sourceMappingURL=get-context-default-auto-build-path.js.map