"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildEventRequest = void 0;
function getEventResponse(service, testValue, awaitId = null) {
    return service.testEmitEvent(testValue, awaitId);
}
function getEventResponsePromise(service, testValue, awaitId) {
    return new Promise((resolve) => {
        resolve(getEventResponse(service, testValue, awaitId));
    });
}
async function buildEventRequest(service, nb = 1, isPromise = false) {
    const requests = {};
    for (let i = 1; i <= nb; i++) {
        const testValue = `testValue${i}`;
        const response = isPromise
            ? getEventResponsePromise(service, testValue, i.toString())
            : await getEventResponse(service, testValue);
        requests[i] = { testValue, response };
    }
    return requests;
}
exports.buildEventRequest = buildEventRequest;
//# sourceMappingURL=event-request.utils.js.map