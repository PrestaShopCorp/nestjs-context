"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildGraphQLRequest = void 0;
const graphql_tag_1 = require("graphql-tag");
const supertest_graphql_1 = require("supertest-graphql");
function getGraphQLResponse(app, testValue, awaitId = null) {
    return (0, supertest_graphql_1.default)(app.getHttpServer())
        .query((0, graphql_tag_1.default) `
        query TestGQLQuery($awaitId: String) {
          testGQLQuery(awaitId: $awaitId) {
            clsId
            context {
              id
              request_id
              correlation_id
              platform
              hostname
              bin
              path
              protocol
              testValue
            }
            contexts
          }
        }
      `)
        .set('x-test-value', testValue)
        .variables({ awaitId })
        .expectNoErrors();
}
function getGraphQLResponsePromise(app, testValue, awaitId) {
    return new Promise((resolve) => {
        resolve(getGraphQLResponse(app, testValue, awaitId).end());
    });
}
async function buildGraphQLRequest(app, nb = 1, isPromise = false) {
    const requests = {};
    for (let i = 1; i <= nb; i++) {
        const testValue = `testValue${i}`;
        const response = isPromise
            ? getGraphQLResponsePromise(app, testValue, i.toString())
            : await getGraphQLResponse(app, testValue);
        requests[i] = { testValue, response };
    }
    return requests;
}
exports.buildGraphQLRequest = buildGraphQLRequest;
//# sourceMappingURL=graphql-request.utils.js.map