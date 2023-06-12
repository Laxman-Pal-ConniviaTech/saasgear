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
exports.inviteTeamMember = exports.createTeam = exports.findTeamByAlias = exports.getAllTeams = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const dayjs_1 = __importDefault(require("dayjs"));
const team_repository_1 = require("~/repository/team.repository");
const team_invitations_repository_1 = require("~/repository/team_invitations.repository");
const format_date_db_1 = __importDefault(require("~/utils/format-date-db"));
const compile_email_template_1 = __importDefault(require("~/helpers/compile-email-template"));
const genarateRandomkey_1 = __importDefault(require("~/helpers/genarateRandomkey"));
const string_helper_1 = require("~/helpers/string.helper");
const logger_1 = __importDefault(require("~/utils/logger"));
const mail_1 = __importDefault(require("~/libs/mail"));
const team_members_repository_1 = require("../../repository/team_members.repository");
const user_repository_1 = require("../../repository/user.repository");
/**
 * Function to get all team
 *
 * @param User user User who execute this function
 *
 */
function getAllTeams(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const allTeams = yield (0, team_repository_1.getAllTeam)({ userId: user.id });
        return allTeams;
    });
}
exports.getAllTeams = getAllTeams;
/**
 * Function to get team by id
 *
 * @param User user   User who execute this function
 * @param int  teamId Id of team want to get
 *
 */
function findTeamByAlias(alias) {
    return __awaiter(this, void 0, void 0, function* () {
        const members = yield (0, team_members_repository_1.getListTeamMemberByAliasTeam)({ alias });
        return members.map((member) => ({
            userName: member.userName,
            userId: member.userId,
            email: member.email,
            status: member.status,
            isOwner: member.userId === member.owner,
        }));
    });
}
exports.findTeamByAlias = findTeamByAlias;
/**
 * Function to create team
 *
 * @param User   user      User who create team
 * @param string teamName  Name of new team
 * @param string teamAlias Alias of new team
 */
function createTeam(user, teamName, teamAlias) {
    return __awaiter(this, void 0, void 0, function* () {
        const alias = (0, string_helper_1.stringToSlug)(teamAlias);
        const team = yield (0, team_repository_1.getTeam)({ alias });
        if (team) {
            throw new apollo_server_express_1.ApolloError('Team exist');
        }
        const teamId = (0, team_repository_1.createNewTeamAndMember)({ name: teamName, alias, userid: user.id });
        return {
            id: teamId,
            name: teamName,
            alias,
        };
    });
}
exports.createTeam = createTeam;
/**
 * Function to invite team member
 *
 * @param User   user         User who create invitation
 * @param int    alias       alias of team you want to invite to join
 * @param string inviteeEmail Email of who you want to send invitation to
 */
function inviteTeamMember(user, alias, inviteeEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const team = yield (0, team_repository_1.getTeam)({ alias });
            if (!team) {
                throw new apollo_server_express_1.ApolloError('Team not found');
            }
            if (user.email === inviteeEmail) {
                throw new apollo_server_express_1.ApolloError('Can\'t invite yourself');
            }
            const member = yield (0, user_repository_1.findUser)({ email: inviteeEmail });
            const token = yield (0, genarateRandomkey_1.default)();
            const subject = 'Team invitation';
            const template = yield (0, compile_email_template_1.default)({
                fileName: 'inviteTeamMember.mjml',
                data: {
                    teamName: team.name,
                    url: `${process.env.FRONTEND_URL}/teams/invitation/${token}`,
                },
            });
            const queries = [(0, mail_1.default)((0, string_helper_1.normalizeEmail)(inviteeEmail), subject, template)];
            if (member) {
                queries.push((0, team_members_repository_1.createMemberAndInviteToken)({
                    email: inviteeEmail,
                    token,
                    teamId: team.id,
                    memberId: member.id,
                    userId: user.id,
                }));
            }
            else {
                queries.push((0, team_invitations_repository_1.createTeamInvitation)({
                    email: inviteeEmail,
                    token,
                    invited_by: user.id,
                    team_id: team.id,
                    valid_until: (0, format_date_db_1.default)((0, dayjs_1.default)().add(team_invitations_repository_1.VALID_PERIOD_DAYS, 'day')),
                    status: 'active',
                }));
            }
            yield Promise.all(queries);
            return {
                userName: member.name,
                userId: member.id,
                email: member.email,
                status: 'pending',
                isOwner: false,
            };
        }
        catch (error) {
            logger_1.default.error(error);
            throw new apollo_server_express_1.ApolloError(error);
        }
    });
}
exports.inviteTeamMember = inviteTeamMember;
//# sourceMappingURL=teams.service.js.map