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
exports.loginGithub = void 0;
const apollo_server_express_1 = __importDefault(require("apollo-server-express"));
const user_repository_1 = require("~/repository/user.repository");
const provider_constant_1 = require("~/constants/provider.constant");
const jwt_helper_1 = require("~/helpers/jwt.helper");
const axios_instance_1 = __importDefault(require("~/utils/axios-instance"));
function loginGithub(code) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield getAccessTokenFromGithub(code);
        if (response.data.error) {
            throw new apollo_server_express_1.default.ApolloError(response.data.error_description);
        }
        const { access_token, token_type } = response.data;
        const userInfoResponse = yield getProfile(`${token_type} ${access_token}`);
        const { name, email, avatar_url, id } = userInfoResponse.data;
        const user = yield (0, user_repository_1.findUser)({ provider_id: `${id}`, provider: provider_constant_1.SOCIAL_PROVIDER.github });
        if (user) {
            return {
                token: (0, jwt_helper_1.sign)({
                    email: user.email,
                    name: user.name,
                    createdAt: user.created_at,
                }),
            };
        }
        yield (0, user_repository_1.createUser)({
            provider: provider_constant_1.SOCIAL_PROVIDER.github,
            email,
            name,
            provider_id: `${id}`,
            avatar_url,
            is_active: true,
        });
        return { token: (0, jwt_helper_1.sign)({ email, name }) };
    });
}
exports.loginGithub = loginGithub;
function getAccessTokenFromGithub(code) {
    return __awaiter(this, void 0, void 0, function* () {
        const path = 'https://github.com/login/oauth/access_token';
        const data = {
            client_id: process.env.GITHUB_CLIENT_KEY,
            client_secret: process.env.GITHUB_SECRET_KEY,
            code,
        };
        return axios_instance_1.default.post(path, data);
    });
}
function getProfile(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const path = 'https://api.github.com/user';
        const config = {
            headers: {
                Authorization: token,
            },
        };
        return axios_instance_1.default.get(path, config);
    });
}
//# sourceMappingURL=github-login.service.js.map