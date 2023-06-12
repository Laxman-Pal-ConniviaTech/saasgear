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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTeamInvitationByToken = exports.getDetailTeamInvitation = exports.getTeamInvitation = exports.createTeamInvitation = exports.teamInvitationsColumns = exports.VALID_PERIOD_DAYS = void 0;
const database_config_1 = __importDefault(require("~/config/database.config"));
const database_constant_1 = require("~/constants/database.constant");
const team_repository_1 = require("./team.repository");
const user_repository_1 = require("./user.repository");
const TABLE = database_constant_1.TABLES.teamInvitations;
exports.VALID_PERIOD_DAYS = 14;
exports.teamInvitationsColumns = {
    email: 'team_invitations.email',
    teamId: 'team_invitations.team_id',
    token: 'team_invitations.token',
    validUntil: 'team_invitations.valid_until',
    invitedBy: 'team_invitations.invited_by',
    status: 'team_invitations.status',
};
/**
 * Function to create team invitation
 *
 * @param object      data        Object contains invitations data
 * @param Transaction transaction Transaction object want to use within query
 */
function createTeamInvitation(data, transaction = null) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = (0, database_config_1.default)(TABLE).insert(data);
        if (!transaction) {
            return query;
        }
        return query.transacting(transaction);
    });
}
exports.createTeamInvitation = createTeamInvitation;
function getTeamInvitation(condition) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, database_config_1.default)(TABLE).where(condition);
    });
}
exports.getTeamInvitation = getTeamInvitation;
/**
 * Function to get team invitation by email, teamId and inviteUserId.
 *
 * @param string email        Email this invitation send to
 * @param int    teamId       Id of team related to this invitation
 * @param int    inviteUserId Id of user who create the invitation
 */
function getDetailTeamInvitation(token) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, database_config_1.default)(TABLE)
            .join(database_constant_1.TABLES.teams, function joinOn() {
            this.on(team_repository_1.teamsColumns.id, '=', exports.teamInvitationsColumns.teamId);
        })
            .join(database_constant_1.TABLES.users, user_repository_1.usersColumns.id, exports.teamInvitationsColumns.invitedBy)
            .where({ [exports.teamInvitationsColumns.token]: token })
            .select({
            owner: user_repository_1.usersColumns.email,
            teamName: team_repository_1.teamsColumns.name,
            until: exports.teamInvitationsColumns.validUntil,
            status: exports.teamInvitationsColumns.status,
        });
    });
}
exports.getDetailTeamInvitation = getDetailTeamInvitation;
function updateTeamInvitationByToken(token, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, database_config_1.default)(TABLE).where({ token }).update(data);
    });
}
exports.updateTeamInvitationByToken = updateTeamInvitationByToken;
// select * from team_invitations
// inner join teams
// on teams.id = team_invitations.team_id
// inner join users on users.id = team_invitations.invited_by
// where team_invitations.token = '3235f68696b46196c00e5aa359273c909613b3514ce9fe819f594f0033421a6c'
// AND(team_invitations.token = '3235f68696b46196c00e5aa359273c909613b3514ce9fe819f594f0033421a6c')
//# sourceMappingURL=team_invitations.repository.js.map