"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextInstanceMock = void 0;
const context_1 = require("../../context");
const contextInstanceMock = new context_1.Context(null, null, null);
exports.contextInstanceMock = contextInstanceMock;
contextInstanceMock.get = jest.fn((test) => test);
contextInstanceMock.getAll = jest.fn(() => { });
//# sourceMappingURL=context-instance.mock.js.map