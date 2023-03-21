"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestModule = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const nestjs_cls_1 = require("nestjs-cls");
const context_module_1 = require("../../../context.module");
const interfaces_1 = require("../../../interfaces");
const async_request_service_exposer_mock_1 = require("../exposers/async-request-service-exposer.mock");
const context_container_exposer_mock_1 = require("../exposers/context-container-exposer.mock");
const test_controller_mock_1 = require("./test-controller.mock");
const test_service_mock_1 = require("./test-service.mock");
const test_resolver_mock_1 = require("./test-resolver.mock");
let TestModule = class TestModule {
};
TestModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_cls_1.ClsModule.forRoot({
                global: true,
                middleware: {
                    mount: true,
                    generateId: true,
                    setup: (cls, request) => {
                        cls.set('testValue', request.headers['x-test-value']);
                    },
                },
            }),
            graphql_1.GraphQLModule.forRoot({
                autoSchemaFile: true,
            }),
            context_module_1.ContextModule.register({
                build: {
                    testValue: ['req.headers.x-test-value'],
                },
                type: interfaces_1.ContextName.HTTP,
            }),
        ],
        controllers: [test_controller_mock_1.TestController],
        providers: [
            context_container_exposer_mock_1.ContextContainerExposer,
            async_request_service_exposer_mock_1.AsyncRequestServiceExposer,
            test_resolver_mock_1.TestResolver,
            test_service_mock_1.TestService,
        ],
    })
], TestModule);
exports.TestModule = TestModule;
//# sourceMappingURL=test-module.mock.js.map