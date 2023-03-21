"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildHttpRequest = void 0;
const request = require("supertest");
function getHttpResponse(app, route, testValue) {
    const response = request(app.getHttpServer())
        .get(route)
        .set('x-test-value', testValue)
        .expect(200);
    return response;
}
function getHttpResponsePromise(app, route, testValue) {
    return new Promise((resolve, reject) => {
        getHttpResponse(app, route, testValue).end((err, res) => {
            if (err) {
                return reject(err);
            }
            resolve(res);
        });
    });
}
async function buildHttpRequest(app, nb = 1, isPromise = false) {
    const requests = {};
    const baseRoute = '/test-http-request';
    for (let i = 1; i <= nb; i++) {
        const testValue = `testValue${i}`;
        const route = isPromise ? `${baseRoute}/${i}` : baseRoute;
        const response = isPromise
            ? getHttpResponsePromise(app, route, testValue)
            : await getHttpResponse(app, route, testValue);
        requests[i] = { testValue, response };
    }
    return requests;
}
exports.buildHttpRequest = buildHttpRequest;
//# sourceMappingURL=http-request.utils.js.map