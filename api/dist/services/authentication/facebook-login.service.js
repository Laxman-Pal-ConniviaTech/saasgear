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
exports.loginFacebook = void 0;
const axios_instance_1 = __importDefault(require("~/utils/axios-instance"));
const user_repository_1 = require("~/repository/user.repository");
const provider_constant_1 = require("~/constants/provider.constant");
const jwt_helper_1 = require("~/helpers/jwt.helper");
function loginFacebook(code) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield getAccessTokenFromFacebook(code);
        const { access_token } = response.data;
        const profileUser = yield getProfileUser(access_token);
        const { email, name, id, picture: { data: { url }, }, } = profileUser.data;
        if (email) {
            const userByEmail = yield (0, user_repository_1.findUser)({ email });
            if ((userByEmail === null || userByEmail === void 0 ? void 0 : userByEmail.provider) === provider_constant_1.SOCIAL_PROVIDER.facebook && (userByEmail === null || userByEmail === void 0 ? void 0 : userByEmail.provider_id) === id) {
                return { token: (0, jwt_helper_1.sign)({ email, name }) };
            }
        }
        const user = yield (0, user_repository_1.findUser)({ provider_id: id, provider: provider_constant_1.SOCIAL_PROVIDER.facebook });
        if (user) {
            return { token: (0, jwt_helper_1.sign)({ email, name }) };
        }
        yield (0, user_repository_1.createUser)({
            provider: provider_constant_1.SOCIAL_PROVIDER.facebook,
            email,
            name,
            provider_id: id,
            avatar_url: url,
            is_active: true,
        });
        return { token: (0, jwt_helper_1.sign)({ email, name }) };
    });
}
exports.loginFacebook = loginFacebook;
function getAccessTokenFromFacebook(code) {
    return __awaiter(this, void 0, void 0, function* () {
        const path = `https://graph.facebook.com/v9.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_KEY}&redirect_uri=${process.env.DOMAIN_FRONTEND}/social/facebook/callback&client_secret=${process.env.FACEBOOK_CLIENT_SECRET_KEY}&code=${code}`;
        return axios_instance_1.default.get(path);
    });
}
function getProfileUser(access_token) {
    return __awaiter(this, void 0, void 0, function* () {
        const fields = encodeURIComponent('id,name,email,picture{url}');
        const path = `https://graph.facebook.com/v9.0/me?fields=${fields}&access_token=${access_token}`;
        return axios_instance_1.default.get(path);
    });
}
//# sourceMappingURL=facebook-login.service.js.map