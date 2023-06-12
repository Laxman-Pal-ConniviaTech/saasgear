"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const graphql_resolvers_1 = require("graphql-resolvers");
const isAuthenticated = (parent, args, { user }) => (user === null || user === void 0 ? void 0 : user.email) ? graphql_resolvers_1.skip : new apollo_server_express_1.AuthenticationError('Authentication fail');
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=authorization.resolver.js.map