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
exports.TestController = void 0;
const common_1 = require("@nestjs/common");
const nestjs_cls_1 = require("nestjs-cls");
const context_1 = require("../../../context");
const async_request_service_exposer_mock_1 = require("../exposers/async-request-service-exposer.mock");
const context_container_exposer_mock_1 = require("../exposers/context-container-exposer.mock");
let TestController = class TestController {
    constructor(cls, context, contextContainer, asyncRequestService) {
        this.cls = cls;
        this.context = context;
        this.contextContainer = contextContainer;
        this.asyncRequestService = asyncRequestService;
    }
    async testHttpRequest(awaitId) {
        const contexts = this.contextContainer.getContexts();
        if (awaitId) {
            await this.asyncRequestService.getResponse(awaitId);
        }
        return {
            clsId: this.cls.getId(),
            context: {
                id: this.context.getId(),
                ...this.context.getAll(),
            },
            contexts: Object.keys(contexts),
        };
    }
};
__decorate([
    (0, common_1.Get)(':awaitId?'),
    __param(0, (0, common_1.Param)('awaitId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TestController.prototype, "testHttpRequest", null);
TestController = __decorate([
    (0, common_1.Controller)('test-http-request'),
    __metadata("design:paramtypes", [nestjs_cls_1.ClsService,
        context_1.Context,
        context_container_exposer_mock_1.ContextContainerExposer,
        async_request_service_exposer_mock_1.AsyncRequestServiceExposer])
], TestController);
exports.TestController = TestController;
//# sourceMappingURL=test-controller.mock.js.map