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
exports.resetPasswordUser = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const dayjs_1 = __importDefault(require("dayjs"));
const user_repository_1 = require("~/repository/user.repository");
const hashing_helper_1 = require("~/helpers/hashing.helper");
const user_tokens_repository_1 = require("~/repository/user_tokens.repository");
const logger_1 = __importDefault(require("~/utils/logger"));
const authenticate_validation_1 = require("~/validations/authenticate.validation");
function resetPasswordUser(token, password, confirmPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const validateResult = (0, authenticate_validation_1.changePasswordValidation)({ password });
            if (Array.isArray(validateResult) && validateResult.length) {
                return new apollo_server_express_1.UserInputError(validateResult.map((it) => it.message).join(','), {
                    invalidArgs: validateResult.map((it) => it.field).join(','),
                });
            }
            if (password !== confirmPassword) {
                return new apollo_server_express_1.ValidationError('Password and confirm password do not match');
            }
            const session = yield (0, user_tokens_repository_1.findToken)(token);
            if (!session || !session.id) {
                return new apollo_server_express_1.ApolloError('Your reset password link is expired');
            }
            if ((0, dayjs_1.default)(session.updated_at).add(15, 'm').diff((0, dayjs_1.default)()) < 0) {
                return new apollo_server_express_1.ForbiddenError('Your reset password link is expired');
            }
            const [newPassword] = yield Promise.all([
                (0, hashing_helper_1.generatePassword)(password),
                (0, user_tokens_repository_1.removeUserToken)(session.id),
            ]);
            yield (0, user_repository_1.updateUser)(session.user_id, { password: newPassword });
            return true;
        }
        catch (error) {
            logger_1.default.error(error);
            throw new apollo_server_express_1.ApolloError('Something went wrong!');
        }
    });
}
exports.resetPasswordUser = resetPasswordUser;
//# sourceMappingURL=reset-password.service.js.map