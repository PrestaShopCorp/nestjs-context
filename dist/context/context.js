"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const lodash_1 = require("lodash");
class Context {
    constructor(id, config, request, moduleRef) {
        this.id = id;
        this.config = config;
        this.request = request;
        this.moduleRef = moduleRef;
        this.cache = new Map();
        this.build = config?.build || {};
    }
    getId() {
        return this.id;
    }
    setCachedValue(key, value) {
        this.cache[key] = value;
        return this;
    }
    getCachedValue(key) {
        return this.cache[key] ?? null;
    }
    isCached(key) {
        return typeof this.cache[key] !== 'undefined';
    }
    getProvider(name) {
        try {
            return this.moduleRef?.get(name);
        }
        catch (e) {
            return undefined;
        }
    }
    buildContextValue(key, definition) {
        if (this.isCached(key)) {
            return this.getCachedValue(key);
        }
        if (typeof definition === 'string' && definition.startsWith('req.')) {
            return (0, lodash_1.get)(this.request, definition.replace(/^req./, ''));
        }
        if (['string', 'symbol', 'function'].includes(typeof definition)) {
            const provider = this.getProvider(definition);
            if (!!provider) {
                return provider.get(this.request, key) || null;
            }
        }
        if (typeof definition === 'function') {
            try {
                return definition(this.request);
            }
            catch (e) {
                return null;
            }
        }
        if (['number', 'string'].includes(typeof definition)) {
            return definition;
        }
        return null;
    }
    get(key) {
        let value = null;
        for (const definition of this.build[key]) {
            value = this.buildContextValue(key, definition) ?? value;
        }
        if (!!this.config.cached) {
            this.setCachedValue(key, value);
        }
        return value;
    }
    getAll(includeNull = false) {
        const context = {};
        if (!this.build) {
            return context;
        }
        for (const key of Object.keys(this.build)) {
            if (key.includes('\\.')) {
                context[key.replace(/\\./g, '.')] = this.get(key);
            }
            else {
                (0, lodash_1.set)(context, key, this.get(key));
            }
        }
        return includeNull
            ? context
            : (0, lodash_1.pickBy)(context, (ctx) => ctx !== null && ctx !== undefined);
    }
    createView(mapping) {
        const labelsMapping = (0, lodash_1.invert)(mapping);
        const toPick = Object.keys(labelsMapping);
        const subContext = (0, lodash_1.pick)(this.getAll(), toPick);
        const view = {};
        toPick.forEach((ctxProperty) => {
            view[labelsMapping[ctxProperty]] = (0, lodash_1.get)(subContext, ctxProperty);
        });
        return view;
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map