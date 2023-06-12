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
exports.acceptInvitation = void 0;
const team_invitations_repository_1 = require("../../repository/team_invitations.repository");
const team_members_repository_1 = require("../../repository/team_members.repository");
function acceptInvitation(token, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const status = type === 'accept' ? 'active' : 'decline';
        yield (0, team_invitations_repository_1.updateTeamInvitationByToken)(token, { status: 'inactive' });
        yield (0, team_members_repository_1.updateTeamMember)({ invitation_token: token }, { status });
        return true;
    });
}
exports.acceptInvitation = acceptInvitation;
//# sourceMappingURL=acceptInvitation.js.map