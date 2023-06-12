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
exports.updateTeamMember = exports.createMemberAndInviteToken = exports.createTeamMember = exports.getListTeamMemberByAliasTeam = exports.teamMembersColumns = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const format_date_db_1 = __importDefault(require("~/utils/format-date-db"));
const database_config_1 = __importDefault(require("~/config/database.config"));
const database_constant_1 = require("~/constants/database.constant");
const team_repository_1 = require("./team.repository");
const user_repository_1 = require("./user.repository");
const team_invitations_repository_1 = require("./team_invitations.repository");
const TABLE = database_constant_1.TABLES.teamMembers;
exports.teamMembersColumns = {
    userId: 'team_members.user_id',
    teamId: 'team_members.team_id',
    status: 'team_members.status',
    createdAt: 'team_members.created_at',
    updatedAt: 'team_members.updated_at',
    deletedAt: 'team_members.deleted_at',
    invitationToken: 'team_members.invitation_token',
};
function getListTeamMemberByAliasTeam({ alias }) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, database_config_1.default)(database_constant_1.TABLES.teams)
            .join(TABLE, team_repository_1.teamsColumns.id, exports.teamMembersColumns.teamId)
            .whereIn(exports.teamMembersColumns.teamId, function subQuery() {
            this.select('id').from(database_constant_1.TABLES.teams).where({ alias });
        }).join(database_constant_1.TABLES.users, exports.teamMembersColumns.userId, user_repository_1.usersColumns.id)
            .select({
            userName: user_repository_1.usersColumns.name,
            userId: user_repository_1.usersColumns.id,
            email: user_repository_1.usersColumns.email,
            status: exports.teamMembersColumns.status,
            owner: team_repository_1.teamsColumns.createdBy,
        });
    });
}
exports.getListTeamMemberByAliasTeam = getListTeamMemberByAliasTeam;
function createTeamMember(data, transaction = null) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = (0, database_config_1.default)(TABLE).insert(data);
        if (!transaction) {
            return query;
        }
        return query.transacting(transaction);
    });
}
exports.createTeamMember = createTeamMember;
function createMemberAndInviteToken({ userId, teamId, memberId, email, token }) {
    return __awaiter(this, void 0, void 0, function* () {
        let transaction;
        try {
            transaction = yield database_config_1.default.transaction();
            yield (0, team_invitations_repository_1.createTeamInvitation)({
                email,
                invited_by: userId,
                team_id: teamId,
                valid_until: (0, format_date_db_1.default)((0, dayjs_1.default)().add(team_invitations_repository_1.VALID_PERIOD_DAYS, 'day')),
                status: 'active',
                token,
            }, transaction);
            yield createTeamMember({ user_id: memberId, team_id: teamId, status: 'pending', invitation_token: token }, transaction);
            yield transaction.commit();
            return true;
        }
        catch (error) {
            transaction.rollback();
            throw new Error(error);
        }
    });
}
exports.createMemberAndInviteToken = createMemberAndInviteToken;
function updateTeamMember(condition, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, database_config_1.default)(TABLE).where(condition).update(data);
    });
}
exports.updateTeamMember = updateTeamMember;
//# sourceMappingURL=team_members.repository.js.map