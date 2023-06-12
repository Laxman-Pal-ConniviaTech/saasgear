"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPlanSchema = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.UserPlanSchema = (0, apollo_server_express_1.gql) `

  type ResponseUserPlan {
    id: Int!
    userId: Int!
    productId: Int!
    priceId: Int!
    name: String!
    amount: Float!
    productType: String!
    priceType: String!
    expiredAt: Date
    deletedAt: Date
  }

  extend type Query {
    getUserPlan: ResponseUserPlan
  }

  extend type Mutation {
    createUserPlan(paymentMethodToken: String!, planName: String!, billingType: BillingType!): Boolean!
    updateUserPlan(userPlanId: Int!, planName: String!, billingType: BillingType!): Boolean!
    deleteUserPlan(userPlanId: Int!): Boolean!
  }
`;
//# sourceMappingURL=user-plan.schema.js.map