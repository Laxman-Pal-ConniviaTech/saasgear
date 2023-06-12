"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_resolver_1 = __importDefault(require("./resolvers/user.resolver"));
const user_plan_resolver_1 = __importDefault(require("./resolvers/user-plan.resolver"));
const team_resolver_1 = __importDefault(require("./resolvers/team.resolver"));
const document_resolver_1 = __importDefault(require("./resolvers/document.resolver"));
exports.default = [user_resolver_1.default, user_plan_resolver_1.default, team_resolver_1.default, document_resolver_1.default];
//# sourceMappingURL=root.resolver.js.map