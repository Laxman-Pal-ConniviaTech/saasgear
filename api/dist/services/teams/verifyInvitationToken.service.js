"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyInvitationToken = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const team_invitations_repository_1 = require("~/repository/team_invitations.repository");
function verifyInvitationToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const [teamInvitation] = yield (0, team_invitations_repository_1.getDetailTeamInvitation)(token);
        if (!teamInvitation || teamInvitation.status === 'inactive') {
            throw new apollo_server_express_1.ApolloError('Token not valid');
        }
        return teamInvitation;
    });
}
exports.verifyInvitationToken = verifyInvitationToken;
//# sourceMappingURL=verifyInvitationToken.service.js.map