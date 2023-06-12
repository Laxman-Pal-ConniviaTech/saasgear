"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamSchema = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.TeamSchema = (0, apollo_server_express_1.gql) `
  enum TeamMemberType {
    active
    inactive
    pending
    decline
  }

  enum JoinTeamType {
    accept
    decline
  }

  type Team {
    id: ID
    name: String
    alias: String
  }

  type TeamMember {
    userName: String
    userId: ID
    email: String
    isOwner: Boolean
    status: TeamMemberType
  }

  type VerifyTokenResponse{
    teamName: String!
    owner: String!
  }

  extend type Query {
    teams: [Team]
    getTeamDetail(alias: String!): [TeamMember]
    verifyInvitationToken(invitationToken: String!): VerifyTokenResponse!
  }

  extend type Mutation {
    createTeam(name: String!, alias: String!): Team,
    inviteMember(email: String!, alias: String!): TeamMember
    joinTeam(type: JoinTeamType!, token: String!): Boolean!
  }
`;
//# sourceMappingURL=team.schema.js.map