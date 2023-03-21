"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTestModule = void 0;
const common_1 = require("@nestjs/common");
const testing_1 = require("@nestjs/testing");
const context_1 = require("../context");
const async_request_service_exposer_mock_1 = require("./mocks/exposers/async-request-service-exposer.mock");
const context_container_exposer_mock_1 = require("./mocks/exposers/context-container-exposer.mock");
const test_module_mock_1 = require("./mocks/module/test-module.mock");
async function buildTestModule() {
    let app;
    class ContextContainerServiceMock {
        initContextContainer() {
            if (!this.contextContainer) {
                this.contextContainer = app.get(context_1.ContextContainer);
            }
        }
        getContexts() {
            this.initContextContainer();
            return this.contextContainer.contexts;
        }
    }
    class AsyncRequestServiceMock {
        constructor() {
            this.promise = {};
            this.resolve = {};
            for (let i = 0; i < 10; i++) {
                this.promise[i.toString()] = new Promise((resolve) => {
                    this.resolve[i.toString()] = resolve;
                });
            }
        }
        getResponse(awaitId) {
            return this.promise[awaitId];
        }
    }
    const moduleRef = await testing_1.Test.createTestingModule({
        imports: [test_module_mock_1.TestModule],
    })
        .overrideProvider(context_container_exposer_mock_1.ContextContainerExposer)
        .useClass(ContextContainerServiceMock)
        .overrideProvider(async_request_service_exposer_mock_1.AsyncRequestServiceExposer)
        .useClass(AsyncRequestServiceMock)
        .setLogger(new common_1.Logger())
        .compile();
    app = moduleRef.createNestApplication();
    return app;
}
exports.buildTestModule = buildTestModule;
//# sourceMappingURL=test-module.builder.js.map