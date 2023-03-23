"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertMultipleContext = exports.assertContext = exports.RequestType = void 0;
var RequestType;
(function (RequestType) {
    RequestType["HTTP"] = "http";
    RequestType["GRAPHQL"] = "graphql";
    RequestType["EVENT"] = "event";
})(RequestType = exports.RequestType || (exports.RequestType = {}));
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
    if (contexts) {
        expect(contexts).not.toBeNull();
        expect(contexts).toHaveLength(contextStackLength);
        expect(contexts).toContainEqual(clsId);
    }
}
exports.assertContext = assertContext;
function assertMultipleContext(nb, requests, requestType) {
    for (let i = 1; i <= nb; i++) {
        let response;
        if (requestType === RequestType.HTTP) {
            response = requests[i].response.body;
        }
        else if (requestType === RequestType.GRAPHQL) {
            response = requests[i].response.data.testGQLQuery;
        }
        else if (requestType === RequestType.EVENT) {
            response = requests[i].response;
        }
        assertContext(response, requests[i].testValue, 1);
    }
}
exports.assertMultipleContext = assertMultipleContext;
//# sourceMappingURL=context.utils.js.map