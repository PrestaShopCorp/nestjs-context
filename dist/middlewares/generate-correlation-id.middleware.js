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
exports.GenerateCorrelationIdMiddleware = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const tools_1 = require("../tools");
const context_1 = require("../context");
let GenerateCorrelationIdMiddleware = class GenerateCorrelationIdMiddleware {
    constructor(context, config) {
        this.context = context;
        this.config = config;
    }
    generateCorrelationId(request) {
        if (!request.headers[constants_1.HEADER_CORRELATION_ID]) {
            const correlationId = (0, tools_1.generateId)();
            request.headers[constants_1.HEADER_CORRELATION_ID] = correlationId;
            this.context.setCachedValue(constants_1.CONTEXT_CORRELATION_ID, correlationId);
        }
    }
    use(req, res, next) {
        this.generateCorrelationId(req);
        next();
    }
};
GenerateCorrelationIdMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(constants_1.CONTEXT_MODULE_CONFIG)),
    __metadata("design:paramtypes", [context_1.Context, Object])
], GenerateCorrelationIdMiddleware);
exports.GenerateCorrelationIdMiddleware = GenerateCorrelationIdMiddleware;
//# sourceMappingURL=generate-correlation-id.middleware.js.map