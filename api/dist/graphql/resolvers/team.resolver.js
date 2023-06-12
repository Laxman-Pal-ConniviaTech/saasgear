"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_resolvers_1 = require("graphql-resolvers");
const teams_service_1 = require("~/services/teams/teams.service");
const verifyInvitationToken_service_1 = require("~/services/teams/verifyInvitationToken.service");
const acceptInvitation_1 = require("~/services/teams/acceptInvitation");
const authorization_resolver_1 = require("./authorization.resolver");
const resolvers = {
    Query: {
        teams: (0, graphql_resolvers_1.combineResolvers)(authorization_resolver_1.isAuthenticated, (_, arg, { user }) => (0, teams_service_1.getAllTeams)(user)),
        getTeamDetail: (0, graphql_resolvers_1.combineResolvers)(authorization_resolver_1.isAuthenticated, (_, { alias }) => (0, teams_service_1.findTeamByAlias)(alias)),
        verifyInvitationToken: (_, { invitationToken }) => (0, verifyInvitationToken_service_1.verifyInvitationToken)(invitationToken),
    },
    Mutation: {
        createTeam: (0, graphql_resolvers_1.combineResolvers)(authorization_resolver_1.isAuthenticated, (_, { name, alias }, { user }) => (0, teams_service_1.createTeam)(user, name, alias)),
        inviteMember: (0, graphql_resolvers_1.combineResolvers)(authorization_resolver_1.isAuthenticated, (_, { email, alias }, { user }) => (0, teams_service_1.inviteTeamMember)(user, alias, email)),
        joinTeam: (0, graphql_resolvers_1.combineResolvers)(authorization_resolver_1.isAuthenticated, (_, { token, type }) => (0, acceptInvitation_1.acceptInvitation)(token, type)),
    },
};
exports.default = resolvers;
//# sourceMappingURL=team.resolver.js.map