"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_resolvers_1 = require("graphql-resolvers");
const document_service_1 = require("~/services/document/document.service");
const authorization_resolver_1 = require("./authorization.resolver");
const resolvers = {
    Query: {
        getDocuments: (0, graphql_resolvers_1.combineResolvers)(authorization_resolver_1.isAuthenticated, (_, { offset, limit }, { user }) => (0, document_service_1.getDocuments)(user.id, offset, limit)),
        getDocumentDetail: (0, graphql_resolvers_1.combineResolvers)(authorization_resolver_1.isAuthenticated, (_, { id }) => (0, document_service_1.getDocumentDetail)(id)),
    },
    Mutation: {
        createDocument: (0, graphql_resolvers_1.combineResolvers)(authorization_resolver_1.isAuthenticated, (_, { name, body }, { user }) => (0, document_service_1.createDocument)(user.id, name, body)),
        updateDocument: (0, graphql_resolvers_1.combineResolvers)(authorization_resolver_1.isAuthenticated, (_, { id, name, body }) => (0, document_service_1.updateDocument)(id, name, body)),
        deleteDocument: (0, graphql_resolvers_1.combineResolvers)(authorization_resolver_1.isAuthenticated, (_, { id }) => (0, document_service_1.deleteDocument)(id)),
    },
};
exports.default = resolvers;
//# sourceMappingURL=document.resolver.js.map