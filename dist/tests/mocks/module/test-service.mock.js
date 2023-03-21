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
const context_container_exposer_mock_1 = require("../exposers/context-container-exposer.mock");
const async_request_service_exposer_mock_1 = require("../exposers/async-request-service-exposer.mock");
const use_cls_teardown_decorator_1 = require("../../../decorators/use-cls-teardown.decorator");
const teardown = function () {
    this.clearContext();
};
let TestService = class TestService {
    constructor(cls, context, contextContainer, contextContainerExposer, asyncRequestService) {
        this.cls = cls;
        this.context = context;
        this.contextContainer = contextContainer;
        this.contextContainerExposer = contextContainerExposer;
        this.asyncRequestService = asyncRequestService;
    }
    clearContext() {
        this.contextContainer.remove();
    }
    async testEmitEvent(testValue, awaitId) {
        const contexts = this.contextContainerExposer.getContexts();
        if (awaitId) {
            await this.asyncRequestService.getResponse(awaitId);
        }
        return {
            clsId: this.cls.getId(),
            context: {
                id: this.context.getId(),
                ...this.context.getAll(),
                testValue: this.cls.get('testValue'),
            },
            contexts: Object.keys(contexts),
        };
    }
};
__decorate([
    (0, use_cls_teardown_decorator_1.UseClsTeardown)({
        generateId: true,
        setup(cls, testValue) {
            cls.set('testValue', testValue);
        },
        teardown,
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
        context_container_exposer_mock_1.ContextContainerExposer,
        async_request_service_exposer_mock_1.AsyncRequestServiceExposer])
], TestService);
exports.TestService = TestService;
//# sourceMappingURL=test-service.mock.js.map