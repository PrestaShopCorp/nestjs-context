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
exports.TestResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const context_response_model_1 = require("../../models/context-response.model");
const nestjs_cls_1 = require("nestjs-cls");
const context_1 = require("../../../context");
const context_container_exposer_mock_1 = require("../exposers/context-container-exposer.mock");
const async_request_service_exposer_mock_1 = require("../exposers/async-request-service-exposer.mock");
let TestResolver = class TestResolver {
    constructor(cls, context, contextContainer, asyncRequestService) {
        this.cls = cls;
        this.context = context;
        this.contextContainer = contextContainer;
        this.asyncRequestService = asyncRequestService;
    }
    async testGQLQuery(awaitId) {
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
    (0, graphql_1.Query)((returns) => context_response_model_1.ContextResponse),
    __param(0, (0, graphql_1.Args)('awaitId', { type: () => String, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TestResolver.prototype, "testGQLQuery", null);
TestResolver = __decorate([
    (0, graphql_1.Resolver)((of) => context_response_model_1.ContextResponse),
    __metadata("design:paramtypes", [nestjs_cls_1.ClsService,
        context_1.Context,
        context_container_exposer_mock_1.ContextContainerExposer,
        async_request_service_exposer_mock_1.AsyncRequestServiceExposer])
], TestResolver);
exports.TestResolver = TestResolver;
//# sourceMappingURL=test-resolver.mock.js.map