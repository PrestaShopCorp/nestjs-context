"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = void 0;
const short = require("short-uuid");
const alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
const generateId = () => {
    return short(alphabet).generate();
};
exports.generateId = generateId;
//# sourceMappingURL=generate-id.js.map