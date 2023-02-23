"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAutomaticBuild = void 0;
const lodash_1 = require("lodash");
const helpers_1 = require("../helpers");
const getContextPropertyCallback = (path) => (request) => (0, lodash_1.get)(request, path);
const getContextPropertiesBuildFromRequestPath = (target, path, contextPropertyCallback = getContextPropertyCallback) => {
    const autoBuildEntries = Object.getOwnPropertyNames(new target()).map((property) => {
        return [
            property,
            [contextPropertyCallback(`${path ? `${path}.` : ''}${property}`)],
        ];
    });
    return Object.fromEntries(autoBuildEntries);
};
const addAutomaticBuild = (build, options) => {
    const optionsWithDefaults = (0, lodash_1.merge)({
        target: {},
        auto: {
            enabled: false,
            blocklist: false,
            path: (0, helpers_1.getContextDefaultAutoBuildPath)(options.type),
            prefix: '',
        },
    }, options);
    const { target, auto } = optionsWithDefaults;
    const { enabled, blocklist, path, prefix } = auto;
    if (!!enabled && !!target) {
        const autoBuilt = getContextPropertiesBuildFromRequestPath(target, path.replace(/^req./, ''));
        const keysToMerge = Object.keys(!!blocklist ? (0, lodash_1.omit)(autoBuilt, blocklist) : autoBuilt);
        for (const key of keysToMerge) {
            build[!!prefix ? `${prefix}.${key}` : key] = [
                ...autoBuilt[key],
                ...(build[key] || []),
            ];
        }
    }
    return build;
};
exports.addAutomaticBuild = addAutomaticBuild;
//# sourceMappingURL=add-automatic-build.js.map