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
exports.CurrentContext = void 0;
const context_container_1 = require("./context-container");
const common_1 = require("@nestjs/common");
let CurrentContext = class CurrentContext {
    constructor(contexts) {
        this.contexts = contexts;
    }
    call(name, ...args) {
        return this.contexts.current()[name](...args);
    }
    get(...args) {
        return this.call('get', ...args);
    }
    getAll(...args) {
        return this.call('getAll', ...args);
    }
    createView(...args) {
        return this.call('createView', ...args);
    }
    getId(...args) {
        return this.call('getId', ...args);
    }
    setCachedValue(...args) {
        return this.call('setCachedValue', ...args);
    }
    getCachedValue(...args) {
        return this.call('getCachedValue', ...args);
    }
};
CurrentContext = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [context_container_1.ContextContainer])
], CurrentContext);
exports.CurrentContext = CurrentContext;
//# sourceMappingURL=current-context.js.map