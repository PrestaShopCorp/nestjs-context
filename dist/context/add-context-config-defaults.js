"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addContextConfigDefaults = void 0;
const os_1 = require("os");
const path_1 = require("path");
const lodash_1 = require("lodash");
const interfaces_1 = require("../interfaces");
const constants_1 = require("../constants");
const createHttpContextDefaults = (config) => {
    const { header = constants_1.HEADER_CORRELATION_ID } = config?.correlation_id ?? {};
    const build = {
        [constants_1.CONTEXT_REQUEST_ID]: [
            `req.${constants_1.HEADER_REQUEST_ID}`,
            `req.${interfaces_1.HttpContextRequestProperty.HEADERS}.${constants_1.HEADER_REQUEST_ID}`,
        ],
        [constants_1.CONTEXT_CORRELATION_ID]: [`req.${interfaces_1.HttpContextRequestProperty.HEADERS}.${header}`],
        [constants_1.CONTEXT_PLATFORM]: [(0, os_1.platform)()],
        [constants_1.CONTEXT_HOSTNAME]: [(0, os_1.hostname)(), 'req.hostname'],
        [constants_1.CONTEXT_BIN]: [
            process.argv?.[1]
                ? (0, path_1.basename)(process.argv[1], (0, path_1.extname)(process.argv[1]))
                : `${(0, os_1.hostname)()}_${process.argv?.[0] || null}`,
        ],
        [constants_1.CONTEXT_PATH]: [
            (req) => req?.baseUrl ? `${req.baseUrl}${req.path || '/'}` : '/',
        ],
        [constants_1.CONTEXT_PROTOCOL]: ['req.protocol'],
        [constants_1.CONTEXT_CONTENT_TYPE]: [`req.${interfaces_1.HttpContextRequestProperty.HEADERS}.${constants_1.HEADER_CONTENT_TYPE}`],
    };
    return {
        build,
        cached: false,
    };
};
const addContextConfigDefaults = (config) => {
    const { type } = config;
    switch (type) {
        case interfaces_1.ContextName.HTTP:
            return (0, lodash_1.merge)(createHttpContextDefaults(config), config);
        default:
            return config;
    }
};
exports.addContextConfigDefaults = addContextConfigDefaults;
//# sourceMappingURL=add-context-config-defaults.js.map