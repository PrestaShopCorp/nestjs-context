"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToContextModule = void 0;
const context_module_1 = require("./context.module");
const convertToContextModule = (convert, config) => {
    const { providers, exports, module, global } = (0, context_module_1.createContextModule)(config);
    return {
        ...convert,
        providers: [...convert.providers, ...providers],
        exports: [...convert.providers, ...exports],
        global,
        module,
    };
};
exports.convertToContextModule = convertToContextModule;
//# sourceMappingURL=convert-to-context-module.js.map