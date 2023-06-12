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
exports.loginGoogle = void 0;
const apollo_server_express_1 = __importDefault(require("apollo-server-express"));
const url_1 = __importDefault(require("url"));
const user_repository_1 = require("~/repository/user.repository");
const axios_instance_1 = __importDefault(require("~/utils/axios-instance"));
const provider_constant_1 = require("~/constants/provider.constant");
const jwt_helper_1 = require("~/helpers/jwt.helper");
function loginGoogle(code) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield getAccessTokenFromGoogle(code);
        if (response.data.error) {
            throw new apollo_server_express_1.default.ApolloError(response.data.error_description);
        }
        const { access_token, token_type } = response.data;
        const userInfo = yield getUserInfo(`${token_type} ${access_token}`);
        const { id, name, email, picture } = userInfo.data;
        const user = yield (0, user_repository_1.findUser)({ provider_id: id, provider: provider_constant_1.SOCIAL_PROVIDER.google });
        if (user)
            return { token: (0, jwt_helper_1.sign)({ email, name }) };
        const userByEmail = yield (0, user_repository_1.findUser)({ email });
        if (userByEmail) {
            if ((userByEmail === null || userByEmail === void 0 ? void 0 : userByEmail.provider) === provider_constant_1.SOCIAL_PROVIDER.google && parseInt(userByEmail === null || userByEmail === void 0 ? void 0 : userByEmail.provider_id, 10) === Number(id)) {
                return { token: (0, jwt_helper_1.sign)({ email, name }) };
            }
        }
        yield (0, user_repository_1.createUser)({
            provider: provider_constant_1.SOCIAL_PROVIDER.google,
            email,
            name,
            provider_id: id,
            avatar_url: picture,
            is_active: true,
        });
        return { token: (0, jwt_helper_1.sign)({ email, name }) };
    });
}
exports.loginGoogle = loginGoogle;
function getAccessTokenFromGoogle(code) {
    return __awaiter(this, void 0, void 0, function* () {
        const path = 'https://oauth2.googleapis.com/token';
        const data = {
            client_id: process.env.GOOGLE_CLIENT_KEY,
            client_secret: process.env.GOOGLE_SECRET_KEY,
            code,
            redirect_uri: `${process.env.FRONTEND_URL}/social/google/callback`,
            grant_type: 'authorization_code',
        };
        const params = new url_1.default.URLSearchParams(data);
        return axios_instance_1.default.post(path, params.toString(), {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
        });
    });
}
function getUserInfo(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const path = 'https://www.googleapis.com/userinfo/v2/me';
        return axios_instance_1.default.get(path, {
            headers: {
                Authorization: token,
            },
        });
    });
}
//# sourceMappingURL=google-login.service.js.map