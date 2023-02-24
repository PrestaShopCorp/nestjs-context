"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildDto = exports.buildDtoFullOptions = exports.buildDtoFactory = void 0;
const short_uuid_1 = require("short-uuid");
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const tools_1 = require("../tools");
const context_1 = require("../context");
const interfaces_1 = require("../interfaces");
const helpers_1 = require("../helpers");
const hasEasyOptions = (args) => {
    return !args.build;
};
const buildDtoFactory = (options, request, addAuto = tools_1.addAutomaticBuild) => {
    const { target, auto = { enabled: false }, build = {} } = options;
    const { enabled: isAuto = false } = auto;
    const config = {
        ...(0, lodash_1.omit)(options, ['target', 'auto']),
        build: isAuto && !!target ? addAuto(build, options) : build,
    };
    return new context_1.Context(`build-dto-${context_1.ContextContainer.getId(request)}-${(0, short_uuid_1.uuid)()}`, config, request).getAll();
};
exports.buildDtoFactory = buildDtoFactory;
const buildDtoFullOptions = (options) => {
    const type = options.type ?? interfaces_1.ContextName.HTTP;
    return hasEasyOptions(options)
        ? { type, build: options }
        : { ...options, type, build: options?.build ?? {} };
};
exports.buildDtoFullOptions = buildDtoFullOptions;
exports.BuildDto = (0, common_1.createParamDecorator)((options, ctx) => {
    const fullOptions = (0, exports.buildDtoFullOptions)(options);
    return (0, exports.buildDtoFactory)(fullOptions, (0, helpers_1.getContextRequest)(fullOptions.type, ctx));
});
//# sourceMappingURL=build-dto.decorator.js.map