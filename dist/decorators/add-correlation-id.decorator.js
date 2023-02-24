"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCorrelationId = void 0;
const lodash_1 = require("lodash");
const index_1 = require("../index");
const context_aware_mixin_1 = require("./context-aware.mixin");
const PathCorrelationIdAware = (path) => (Target) => {
    const correlationIdPathParts = path.split('.');
    const accessorPropertyName = correlationIdPathParts.shift();
    const dataPropertyName = `__add-correlation-id-${accessorPropertyName}`;
    const newClass = class extends Target {
        constructor(...args) {
            super(...args);
            const descriptor = this[accessorPropertyName]
                ? (0, lodash_1.cloneDeep)(this[accessorPropertyName])
                : {};
            Object.defineProperty(this, dataPropertyName, {
                enumerable: false,
                value: descriptor,
            });
            Object.defineProperty(this, accessorPropertyName, {
                enumerable: true,
                get() {
                    if (correlationIdPathParts.length === 0) {
                        return this.__context.get(index_1.CONTEXT_CORRELATION_ID);
                    }
                    return (0, lodash_1.set)(this[dataPropertyName], correlationIdPathParts, this.__context.get(index_1.CONTEXT_CORRELATION_ID));
                },
                set(value) {
                    this[dataPropertyName] = value;
                },
            });
        }
    };
    Object.defineProperty(newClass, 'name', {
        value: Target.name,
    });
    return newClass;
};
const AddCorrelationId = (path) => (target) => {
    return (0, context_aware_mixin_1.ContextAwareMixin)()(PathCorrelationIdAware(path)(target));
};
exports.AddCorrelationId = AddCorrelationId;
//# sourceMappingURL=add-correlation-id.decorator.js.map