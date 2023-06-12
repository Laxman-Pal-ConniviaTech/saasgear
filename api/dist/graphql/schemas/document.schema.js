"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentSchema = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.DocumentSchema = (0, apollo_server_express_1.gql) `
  type Document {
    id: ID!
    name: String!
    body: String!
    createdBy: String!
    createdAt: Date!
  }

  type DocumentList {
    documents: [Document!]
    count: Int!
  }

  extend type Query {
    getDocuments(offset: Int, limit: Int): DocumentList,
    getDocumentDetail(id: Int!): Document,
  }

  extend type Mutation {
    createDocument(name: String!, body: String!): Document,
    updateDocument(id: Int!, name: String!, body: String!): Document,
    deleteDocument(id: Int!): Boolean!,
  }
`;
//# sourceMappingURL=document.schema.js.map