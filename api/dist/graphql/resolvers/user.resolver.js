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
const graphql_resolvers_1 = require("graphql-resolvers");
const authorization_resolver_1 = require("./authorization.resolver");
const register_service_1 = require("~/services/authentication/register.service");
const login_service_1 = require("~/services/authentication/login.service");
const verify_email_service_1 = require("~/services/authentication/verify-email.service");
const forgot_password_service_1 = require("~/services/authentication/forgot-password.service");
const reset_password_service_1 = require("~/services/authentication/reset-password.service");
const change_password_service_1 = require("~/services/authentication/change-password.service");
const social_login_service_1 = require("~/services/authentication/social-login.service");
const register_social_service_1 = require("~/services/authentication/register-social.service");
const delete_user_service_1 = require("~/services/user/delete-user.service");
const update_user_service_1 = require("~/services/user/update-user.service");
const string_helper_1 = require("~/helpers/string.helper");
const cookie_1 = require("~/utils/cookie");
const resolvers = {
    Query: {
        profileUser: (0, graphql_resolvers_1.combineResolvers)(authorization_resolver_1.isAuthenticated, (_, args, { user }) => user),
        loginBySocial: (_, { provider, code }, { res }) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, social_login_service_1.loginSocial)(provider, code);
            if (result && result.token) {
                (0, cookie_1.setAuthenticationCookie)(res, result.token);
                return true;
            }
            return result;
        }),
    },
    Mutation: {
        register: (_, { email, password, name, paymentMethodToken, planName, billingType }, { res }) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, register_service_1.registerUser)((0, string_helper_1.normalizeEmail)(email), password, name, paymentMethodToken, planName, billingType);
            if (result && result.token) {
                (0, cookie_1.setAuthenticationCookie)(res, result.token);
                return true;
            }
            return result;
        }),
        login: (_, { email, password }, { res }) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, login_service_1.loginUser)((0, string_helper_1.normalizeEmail)(email), password, res);
            if (result && result.token) {
                (0, cookie_1.setAuthenticationCookie)(res, result.token);
                return true;
            }
            return result;
        }),
        logout: (_, __, { res }) => {
            (0, cookie_1.clearCookie)(res, cookie_1.COOKIE_NAME.TOKEN);
            return true;
        },
        forgotPassword: (_, { email }) => __awaiter(void 0, void 0, void 0, function* () { return (0, forgot_password_service_1.forgotPasswordUser)((0, string_helper_1.normalizeEmail)(email)); }),
        changePassword: (0, graphql_resolvers_1.combineResolvers)(authorization_resolver_1.isAuthenticated, (_, { currentPassword, newPassword }, { user }) => (0, change_password_service_1.changePasswordUser)(user.id, currentPassword, newPassword)),
        resetPassword: (_, { token, password, confirmPassword }) => __awaiter(void 0, void 0, void 0, function* () { return (0, reset_password_service_1.resetPasswordUser)(token, password, confirmPassword); }),
        verify: (_, { token }) => (0, verify_email_service_1.verifyEmail)(token),
        resendEmail: (0, graphql_resolvers_1.combineResolvers)(authorization_resolver_1.isAuthenticated, (_, { type }, { user }) => (0, verify_email_service_1.resendEmailAction)(user, (0, string_helper_1.normalizeEmail)(type))),
        registerSocialAccount: (_, { provider, email, name, avatarUrl, providerId }, { res }) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, register_social_service_1.registerAccountBySocial)(provider, (0, string_helper_1.normalizeEmail)(email), name, avatarUrl, providerId);
            if (result && result.token) {
                (0, cookie_1.setAuthenticationCookie)(res, result.token);
                return true;
            }
            return result;
        }),
        deleteAccount: (0, graphql_resolvers_1.combineResolvers)(authorization_resolver_1.isAuthenticated, (_, __, { user, res }) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, delete_user_service_1.deleteUser)(user);
            if (result === true) {
                (0, cookie_1.clearCookie)(res, cookie_1.COOKIE_NAME.TOKEN);
            }
            return result;
        })),
        updateProfile: (0, graphql_resolvers_1.combineResolvers)(authorization_resolver_1.isAuthenticated, (_, { name, company, position }, { user }) => (0, update_user_service_1.updateProfile)(user.id, name, company, position)),
        updateProfileAvatar: (0, graphql_resolvers_1.combineResolvers)(authorization_resolver_1.isAuthenticated, (_, { file }, { user }) => (0, update_user_service_1.changeUserAvatar)(file, user)),
    },
};
exports.default = resolvers;
//# sourceMappingURL=user.resolver.js.map