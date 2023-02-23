"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorrelationId = void 0;
const __1 = require("..");
const CorrelationId = () => (target, propertyKey) => {
    Object.defineProperty(target, propertyKey, {
        configurable: false,
        enumerable: true,
        get() {
            return this.__context.get(__1.CONTEXT_CORRELATION_ID);
        },
        set: undefined,
    });
};
exports.CorrelationId = CorrelationId;
//# sourceMappingURL=correlation-id.decorator.js.map