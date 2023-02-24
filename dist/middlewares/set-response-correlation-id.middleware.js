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
exports.SetResponseCorrelationIdMiddleware = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const constants_1 = require("../constants");
const context_1 = require("../context");
let SetResponseCorrelationIdMiddleware = class SetResponseCorrelationIdMiddleware {
    constructor(context, config) {
        this.context = context;
        this.config = config;
    }
    setResponseCorrelationId(response) {
        const headerName = (0, lodash_1.startCase)(this.config?.correlation_id?.header ?? constants_1.HEADER_CORRELATION_ID).replace(/ /g, '-');
        if (!!this.context.get(constants_1.CONTEXT_CORRELATION_ID)) {
            response.set((0, lodash_1.startCase)(headerName).replace(/ /g, '-'), this.context.get(constants_1.CONTEXT_CORRELATION_ID));
        }
    }
    use(req, res, next) {
        this.setResponseCorrelationId(res);
        next();
    }
};
SetResponseCorrelationIdMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(constants_1.CONTEXT_MODULE_CONFIG)),
    __metadata("design:paramtypes", [context_1.Context, Object])
], SetResponseCorrelationIdMiddleware);
exports.SetResponseCorrelationIdMiddleware = SetResponseCorrelationIdMiddleware;
//# sourceMappingURL=set-response-correlation-id.middleware.js.map