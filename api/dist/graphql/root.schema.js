"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const user_schema_1 = require("./schemas/user.schema");
const user_plan_schema_1 = require("./schemas/user-plan.schema");
const team_schema_1 = require("./schemas/team.schema");
const document_schema_1 = require("./schemas/document.schema");
const rootSchema = (0, apollo_server_express_1.gql) `
  scalar Date
  scalar JSON
  scalar Upload

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;
exports.default = [rootSchema, user_schema_1.UserSchema, user_plan_schema_1.UserPlanSchema, team_schema_1.TeamSchema, document_schema_1.DocumentSchema];
//# sourceMappingURL=root.schema.js.map