"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateContextMiddleware = void 0;
const common_1 = require("@nestjs/common");
const context_container_1 = require("../context/context-container");
let CreateContextMiddleware = class CreateContextMiddleware {
    constructor(contexts) {
        this.contexts = contexts;
    }
    use(req, res, next) {
        this.contexts.add(req);
        res.on('finish', () => {
            this.contexts.remove();
        });
        next();
    }
};
CreateContextMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [context_container_1.ContextContainer])
], CreateContextMiddleware);
exports.CreateContextMiddleware = CreateContextMiddleware;
//# sourceMappingURL=create-context.middleware.js.map