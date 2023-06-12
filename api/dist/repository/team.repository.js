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
exports.createNewTeamAndMember = exports.getTeam = exports.getAllTeam = exports.updateTeam = exports.insertTeam = exports.teamsColumns = void 0;
const database_config_1 = __importDefault(require("~/config/database.config"));
const database_constant_1 = require("~/constants/database.constant");
const team_members_repository_1 = require("./team_members.repository");
const TABLE = database_constant_1.TABLES.teams;
exports.teamsColumns = {
    id: 'teams.id',
    name: 'teams.name',
    alias: 'teams.alias',
    createAt: 'teams.created_at',
    updatedAt: 'teams.updated_at',
    deletedAt: 'teams.deleted_at',
    createdBy: 'teams.created_by',
};
/**
 * Function to create Team
 *
 * @param object      data        Object contains data of team. Example: {name, alias, created_by}
 * @param Transaction transaction Transaction object want to use within query
 *
 */
function insertTeam(data, transaction = null) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = (0, database_config_1.default)(TABLE).insert(data);
        if (!transaction) {
            return query;
        }
        return query.transacting(transaction);
    });
}
exports.insertTeam = insertTeam;
/**
 * Function to update team
 *
 * @param int         teamId      Id of team want to update
 * @param object      data        Object contains update data of team. Example: {name, alias, create_by}
 * @param Transaction transaction Transaction object want to use within query
 *
 */
function updateTeam(teamId, data, transaction = null) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = (0, database_config_1.default)(TABLE).where({ id: teamId }).update(data);
        if (!transaction) {
            return query;
        }
        return query.transacting(transaction);
    });
}
exports.updateTeam = updateTeam;
/**
 * Function to get all team
 *
 */
function getAllTeam({ teamId, userId }) {
    return __awaiter(this, void 0, void 0, function* () {
        const condition = {
            [team_members_repository_1.teamMembersColumns.status]: 'active',
        };
        if (teamId)
            condition[team_members_repository_1.teamMembersColumns.teamId] = teamId;
        if (userId)
            condition[team_members_repository_1.teamMembersColumns.userId] = userId;
        return (0, database_config_1.default)(TABLE)
            .join(database_constant_1.TABLES.teamMembers, exports.teamsColumns.id, team_members_repository_1.teamMembersColumns.teamId)
            .where(condition);
    });
}
exports.getAllTeam = getAllTeam;
/**
 * This function is used to get team by search data
 *
 * @param object searchData Object contains search data. Example: {name, alias, created_by}
 */
function getTeam(searchData) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, database_config_1.default)(TABLE).where(searchData).first();
    });
}
exports.getTeam = getTeam;
function createNewTeamAndMember({ name, alias, userid }) {
    return __awaiter(this, void 0, void 0, function* () {
        let transaction;
        try {
            transaction = yield database_config_1.default.transaction();
            const [teamId] = yield insertTeam({ name, alias, created_by: userid }, transaction);
            yield (0, team_members_repository_1.createTeamMember)({ user_id: userid, team_id: teamId, status: 'active' }, transaction);
            yield transaction.commit();
            return teamId;
        }
        catch (error) {
            transaction.rollback();
            return new Error(error);
        }
    });
}
exports.createNewTeamAndMember = createNewTeamAndMember;
//# sourceMappingURL=team.repository.js.map