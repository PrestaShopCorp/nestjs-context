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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_cls_1 = require("nestjs-cls");
const context_1 = require("../../../context");
const async_request_service_exposer_mock_1 = require("../exposers/async-request-service-exposer.mock");
const lru_cache_1 = require("lru-cache");
let TestService = class TestService {
    constructor(cls, context, contextContainer, asyncRequestService) {
        this.cls = cls;
        this.context = context;
        this.contextContainer = contextContainer;
        this.asyncRequestService = asyncRequestService;
        this.cache = new lru_cache_1.default({ max: 50 });
    }
    clearContext() {
        this.contextContainer.remove();
    }
    async testEmitEvent(testValue, awaitId) {
        const clsId = this.cls.getId();
        const id = this.context.getId();
        if (awaitId) {
            await this.asyncRequestService.getResponse(awaitId);
        }
        return {
            clsId,
            context: {
                id,
                ...this.context.getAll(),
                testValue: this.cls.get('testValue'),
            },
        };
    }
};
__decorate([
    (0, nestjs_cls_1.UseCls)({
        generateId: true,
        setup(cls, testValue) {
            cls.set('testValue', testValue);
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TestService.prototype, "testEmitEvent", null);
TestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_cls_1.ClsService,
        context_1.Context,
        context_1.ContextContainer,
        async_request_service_exposer_mock_1.AsyncRequestServiceExposer])
], TestService);
exports.TestService = TestService;
//# sourceMappingURL=test-service.mock.js.map