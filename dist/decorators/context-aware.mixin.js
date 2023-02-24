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
exports.ContextAwareMixin = exports.__context = void 0;
const context_1 = require("../context");
const common_1 = require("@nestjs/common");
exports.__context = Symbol();
const ContextAwareMixin = () => {
    return (target) => {
        var _a;
        if (Reflect.getOwnMetadata(exports.__context, target)) {
            return target;
        }
        let ContextAwareClass = class ContextAwareClass extends target {
            get __context() {
                return this[exports.__context];
            }
        };
        _a = exports.__context;
        __decorate([
            (0, common_1.Inject)(),
            __metadata("design:type", context_1.Context)
        ], ContextAwareClass.prototype, _a, void 0);
        ContextAwareClass = __decorate([
            (0, common_1.Injectable)()
        ], ContextAwareClass);
        Object.defineProperty(ContextAwareClass, 'name', { value: target.name });
        Reflect.defineMetadata(exports.__context, true, target);
        return ContextAwareClass;
    };
};
exports.ContextAwareMixin = ContextAwareMixin;
//# sourceMappingURL=context-aware.mixin.js.map