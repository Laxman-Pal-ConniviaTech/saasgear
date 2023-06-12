"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_resolvers_1 = require("graphql-resolvers");
const plans_user_service_1 = require("~/services/user/plans-user.service");
const authorization_resolver_1 = require("./authorization.resolver");
const resolvers = {
    Query: {
        getUserPlan: (0, graphql_resolvers_1.combineResolvers)(authorization_resolver_1.isAuthenticated, (_, args, { user }) => (0, plans_user_service_1.getUserPlan)(user.id)),
    },
    Mutation: {
        createUserPlan: (0, graphql_resolvers_1.combineResolvers)(authorization_resolver_1.isAuthenticated, (_, { paymentMethodToken, planName, billingType }, { user }) => (0, plans_user_service_1.createUserPlan)(user.id, paymentMethodToken, planName, billingType)),
        updateUserPlan: (0, graphql_resolvers_1.combineResolvers)(authorization_resolver_1.isAuthenticated, (_, { userPlanId, planName, billingType }) => (0, plans_user_service_1.updateUserPlan)(userPlanId, planName, billingType)),
        deleteUserPlan: (0, graphql_resolvers_1.combineResolvers)(authorization_resolver_1.isAuthenticated, (_, { userPlanId }) => (0, plans_user_service_1.deleteUserPlan)(userPlanId)),
    },
};
exports.default = resolvers;
//# sourceMappingURL=user-plan.resolver.js.map