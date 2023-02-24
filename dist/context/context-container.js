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
exports.ContextContainer = void 0;
const context_1 = require("./context");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const constants_1 = require("../constants");
const tools_1 = require("../tools");
const nestjs_cls_1 = require("nestjs-cls");
let ContextContainer = class ContextContainer {
    constructor(config, cls, moduleRef) {
        this.config = config;
        this.cls = cls;
        this.moduleRef = moduleRef;
        this.contexts = {};
        this.contextStack = [];
    }
    static getId(request) {
        if (!!request.headers) {
            return request.headers[constants_1.HEADER_REQUEST_ID];
        }
        return request[constants_1.HEADER_REQUEST_ID];
    }
    current() {
        const id = this.cls.getId() ?? (0, tools_1.generateId)();
        const request = {
            [constants_1.HEADER_REQUEST_ID]: id,
        };
        if (this.contexts[id]) {
            console.log('current context found : ', {
                id: this.contexts[id].getId(),
                baseUrl: this.contexts[id].request.baseUrl,
                body: this.contexts[id].request.body,
                headerCorrelationId: this.contexts[id].getCachedValue('x-correlation-id'),
                contextCorrelationId: this.contexts[id].getCachedValue('correlation_id'),
                headerRequestId: this.contexts[id].getCachedValue('x-request-id'),
                contextRequestId: this.contexts[id].getCachedValue('request_id'),
                hostname: this.contexts[id].getCachedValue('hostname'),
                bin: this.contexts[id].getCachedValue('bin'),
                path: this.contexts[id].getCachedValue('path'),
            });
        }
        else {
            console.log('current context not found');
        }
        return this.contextStack.length && this.contexts[id]
            ? this.contexts[id]
            : this.add(request);
    }
    get(request) {
        const id = this.cls.getId();
        console.log('request ID CLS : ', id);
        if (this.contexts[id]) {
            console.log('get context found : ', {
                id: this.contexts[id].getId(),
                baseUrl: this.contexts[id].request.baseUrl,
                body: this.contexts[id].request.body,
                headerCorrelationId: this.contexts[id].getCachedValue('x-correlation-id'),
                contextCorrelationId: this.contexts[id].getCachedValue('correlation_id'),
                headerRequestId: this.contexts[id].getCachedValue('x-request-id'),
                contextRequestId: this.contexts[id].getCachedValue('request_id'),
                hostname: this.contexts[id].getCachedValue('hostname'),
                bin: this.contexts[id].getCachedValue('bin'),
                path: this.contexts[id].getCachedValue('path'),
            });
        }
        else {
            console.log('get context not found');
        }
        return this.contexts[id] ?? null;
    }
    add(request) {
        const id = this.cls.getId();
        this.contextStack.push(id);
        this.contexts[id] = new context_1.Context(id, this.config, request, this.moduleRef);
        console.log('context stack after adding : ', this.contextStack);
        console.log('context added : ', {
            id: this.contexts[id].getId(),
            baseUrl: this.contexts[id].request.baseUrl,
            body: this.contexts[id].request.body,
            headerCorrelationId: this.contexts[id].getCachedValue('x-correlation-id'),
            contextCorrelationId: this.contexts[id].getCachedValue('correlation_id'),
            headerRequestId: this.contexts[id].getCachedValue('x-request-id'),
            contextRequestId: this.contexts[id].getCachedValue('request_id'),
            hostname: this.contexts[id].getCachedValue('hostname'),
            bin: this.contexts[id].getCachedValue('bin'),
            path: this.contexts[id].getCachedValue('path'),
        });
        return this.contexts[id];
    }
    remove() {
        const id = this.cls.getId();
        const index = this.contextStack.indexOf(id);
        console.log('request ID CLS : ', id);
        delete this.contexts[id];
        this.contextStack.splice(index, 1);
        console.log('context removed  : ', id);
        console.log('remaining stack : ', this.contextStack);
    }
};
ContextContainer = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.CONTEXT_MODULE_CONFIG)),
    __metadata("design:paramtypes", [Object, nestjs_cls_1.ClsService,
        core_1.ModuleRef])
], ContextContainer);
exports.ContextContainer = ContextContainer;
//# sourceMappingURL=context-container.js.map