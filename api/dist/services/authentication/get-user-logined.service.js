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
const apollo_server_express_1 = require("apollo-server-express");
const jwt_helper_1 = require("~/helpers/jwt.helper");
const user_repository_1 = require("~/repository/user.repository");
const team_invitations_repository_1 = require("~/repository/team_invitations.repository");
function getUserLogined(bearerToken, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (bearerToken) {
            try {
                const token = bearerToken.split(' ');
                if (!token[1] || token[0] !== 'Bearer') {
                    return null;
                }
                const verifyToken = (0, jwt_helper_1.verify)(token[1]);
                if (typeof verifyToken === 'object') {
                    const { user } = verifyToken;
                    const userInfo = yield (0, user_repository_1.findUser)({ email: user.email });
                    const [invitationToken] = yield (0, team_invitations_repository_1.getTeamInvitation)({ email: user.email, status: 'active' });
                    return {
                        id: userInfo.id,
                        email: userInfo.email,
                        name: userInfo.name,
                        isActive: userInfo.is_active,
                        position: userInfo.position,
                        company: userInfo.company,
                        avatarUrl: userInfo.avatar_url,
                        invitationToken: invitationToken ? invitationToken.token : null,
                    };
                }
            }
            catch (error) {
                res.clearCookie('token');
                throw new apollo_server_express_1.AuthenticationError('Authentication failure');
            }
        }
        return null;
    });
}
exports.default = getUserLogined;
//# sourceMappingURL=get-user-logined.service.js.map