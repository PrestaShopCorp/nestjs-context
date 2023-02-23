"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextModule = exports.createContextModule = void 0;
const common_1 = require("@nestjs/common");
const interfaces_1 = require("./interfaces");
const middlewares_1 = require("./middlewares");
const constants_1 = require("./constants");
const context_1 = require("./context");
const current_context_1 = require("./context/current-context");
const nestjs_cls_1 = require("nestjs-cls");
const createContextModule = (config = {
    type: interfaces_1.ContextName.HTTP,
    build: {},
}) => {
    const { providers = [], imports = [], addDefaults = true } = config;
    const configUseValue = addDefaults
        ? (0, context_1.addContextConfigDefaults)(config)
        : config;
    return {
        module: ContextModule,
        providers: [
            ...providers,
            {
                provide: constants_1.CONTEXT_MODULE_CONFIG,
                useValue: configUseValue,
            },
            context_1.ContextContainer,
            current_context_1.CurrentContext,
            {
                provide: context_1.Context,
                useExisting: current_context_1.CurrentContext,
            },
        ],
        imports,
        exports: [context_1.Context],
        global: true,
    };
};
exports.createContextModule = createContextModule;
let ContextModule = class ContextModule {
    constructor(config) {
        this.config = config;
        this.alreadyRegister = false;
    }
    static registerWithDefaults(config) {
        return (0, exports.createContextModule)(config);
    }
    static register(config) {
        return (0, exports.createContextModule)(config);
    }
    configure(consumer) {
        if (this.alreadyRegister) {
            return;
        }
        const allRoutes = {
            path: '*',
            method: common_1.RequestMethod.ALL,
        };
        consumer
            .apply(middlewares_1.GenerateRequestIdMiddleware, middlewares_1.CreateContextMiddleware, middlewares_1.SetResponseCorrelationIdMiddleware)
            .forRoutes(allRoutes);
        const routes = this.config?.correlation_id?.routes ?? allRoutes;
        consumer.apply(middlewares_1.GenerateCorrelationIdMiddleware).forRoutes(routes);
        this.alreadyRegister = true;
    }
};
ContextModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            nestjs_cls_1.ClsModule.forRoot({
                global: true,
                middleware: {
                    mount: true,
                    generateId: true,
                },
            }),
        ],
        providers: [],
        controllers: [],
    }),
    __param(0, (0, common_1.Inject)(constants_1.CONTEXT_MODULE_CONFIG)),
    __metadata("design:paramtypes", [Object])
], ContextModule);
exports.ContextModule = ContextModule;
//# sourceMappingURL=context.module.js.map