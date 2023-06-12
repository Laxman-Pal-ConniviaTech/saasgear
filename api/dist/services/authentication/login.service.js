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
exports.loginUser = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const hashing_helper_1 = require("~/helpers/hashing.helper");
const jwt_helper_1 = require("~/helpers/jwt.helper");
const user_repository_1 = require("~/repository/user.repository");
const authenticate_validation_1 = require("~/validations/authenticate.validation");
const cookie_1 = require("~/utils/cookie");
function loginUser(email, password, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const validateResult = (0, authenticate_validation_1.loginValidation)({ email, password });
        if (Array.isArray(validateResult) && validateResult.length) {
            return new apollo_server_express_1.ValidationError(validateResult.map((it) => it.message).join(','));
        }
        const user = yield (0, user_repository_1.findUser)({ email });
        if (!user) {
            (0, cookie_1.clearCookie)(res, cookie_1.COOKIE_NAME.TOKEN);
            return new apollo_server_express_1.AuthenticationError('Invalid email or password');
        }
        const matchPassword = yield (0, hashing_helper_1.comparePassword)(password, user.password);
        if (!matchPassword) {
            (0, cookie_1.clearCookie)(res, cookie_1.COOKIE_NAME.TOKEN);
            return new apollo_server_express_1.AuthenticationError('Invalid email or password');
        }
        return {
            token: (0, jwt_helper_1.sign)({
                email: user.email,
                name: user.name,
                createdAt: user.created_at,
            }),
        };
    });
}
exports.loginUser = loginUser;
//# sourceMappingURL=login.service.js.map