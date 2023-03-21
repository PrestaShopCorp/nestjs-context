"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseClsTeardown = void 0;
const common_1 = require("@nestjs/common");
const nestjs_cls_1 = require("nestjs-cls");
require("reflect-metadata");
const context_1 = require("../context");
function UseClsTeardown(maybeOptions) {
    const injectContextContainer = (0, common_1.Inject)(context_1.ContextContainer);
    return (target, propertyKey, descriptor) => {
        const decoratorOptions = new nestjs_cls_1.ClsDecoratorOptions();
        const options = { ...decoratorOptions, ...maybeOptions };
        const cls = nestjs_cls_1.ClsServiceManager.getClsService();
        const original = descriptor.value;
        if (typeof original !== 'function') {
            throw new Error(`The @UseClsTeardown decorator can be only used on functions, but ${propertyKey.toString()} is not a function.`);
        }
        descriptor.value = function (...args) {
            return cls
                .run(async () => {
                if (options.generateId) {
                    const id = await options.idGenerator?.apply(this, args);
                    cls.set(nestjs_cls_1.CLS_ID, id);
                }
                if (options.setup) {
                    await options.setup.apply(this, [cls, ...args]);
                }
                if (options.resolveProxyProviders) {
                    await cls.resolveProxyProviders();
                }
                return original.apply(this, args);
            })
                .then((response) => {
                injectContextContainer(target, '__myCtxContainer');
                const contextContainer = this.__myCtxContainer;
                return response;
            });
        };
        copyMetadata(original, descriptor.value);
    };
}
exports.UseClsTeardown = UseClsTeardown;
function copyMetadata(from, to) {
    const metadataKeys = Reflect.getMetadataKeys(from);
    metadataKeys.map((key) => {
        const value = Reflect.getMetadata(key, from);
        Reflect.defineMetadata(key, value, to);
    });
}
//# sourceMappingURL=use-cls-teardown.decorator.js.map