"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertCache = void 0;
function assertCache(cache, expectedItems, requests) {
    expect(cache.size).toEqual(expectedItems);
    for (let i = 1; i <= requests.length; i++) {
        const response = requests[i].response;
        expect(cache.get(response.clsId).getId()).toEqual(response.clsId);
    }
}
exports.assertCache = assertCache;
//# sourceMappingURL=cache-utils.js.map