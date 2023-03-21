"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertMultipleContext = exports.assertContext = void 0;
function assertContext(response, contextTestValue, contextStackLength) {
    const { context, clsId, contexts } = response;
    expect(context).not.toBeNull();
    expect(context.id).toEqual(clsId);
    expect(context.testValue).toEqual(contextTestValue);
    expect(context.request_id).not.toBeNull();
    expect(context.correlation_id).not.toBeNull();
    expect(context.platform).not.toBeNull();
    expect(context.hostname).not.toBeNull();
    expect(context.bin).not.toBeNull();
    expect(context.path).not.toBeNull();
    expect(context.protocol).not.toBeNull();
    expect(contexts).not.toBeNull();
    expect(contexts).toHaveLength(contextStackLength);
    expect(contexts).toContainEqual(clsId);
}
exports.assertContext = assertContext;
function assertMultipleContext(nb, requests) {
    for (let i = 1; i <= nb; i++) {
        assertContext(requests[i].response, requests[i].testValue, 1);
    }
}
exports.assertMultipleContext = assertMultipleContext;
//# sourceMappingURL=context.utils.js.map