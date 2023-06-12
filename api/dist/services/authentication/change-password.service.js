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
exports.changePasswordUser = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const dayjs_1 = __importDefault(require("dayjs"));
const user_repository_1 = require("~/repository/user.repository");
const logger_1 = __importDefault(require("~/utils/logger"));
const mail_1 = __importDefault(require("~/libs/mail"));
const compile_email_template_1 = __importDefault(require("~/helpers/compile-email-template"));
const hashing_helper_1 = require("~/helpers/hashing.helper");
const authenticate_validation_1 = require("~/validations/authenticate.validation");
function changePasswordUser(userId, currentPassword, newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield (0, user_repository_1.findUser)({ id: userId });
            if (!user || !user.id) {
                return new apollo_server_express_1.ApolloError('Can not find any user');
            }
            const validateResult = (0, authenticate_validation_1.changePasswordValidation)({ password: newPassword });
            if (Array.isArray(validateResult) && validateResult.length) {
                return new apollo_server_express_1.UserInputError(validateResult.map((it) => it.message).join(','), {
                    invalidArgs: validateResult.map((it) => it.field).join(','),
                });
            }
            const matchPassword = yield (0, hashing_helper_1.comparePassword)(currentPassword, user.password);
            if (!matchPassword) {
                return new apollo_server_express_1.ApolloError('Current password is not correct');
            }
            const passwordHashed = yield (0, hashing_helper_1.generatePassword)(newPassword);
            yield (0, user_repository_1.updateUser)(user.id, { password: passwordHashed });
            const template = yield (0, compile_email_template_1.default)({
                fileName: 'changePassword.mjml',
                data: {
                    name: user.name,
                    date: (0, dayjs_1.default)().format('dddd, MMMM D, YYYY h:mm A'),
                },
            });
            yield (0, mail_1.default)(user.email, 'Change Password from SaaSgear', template);
            return true;
        }
        catch (error) {
            logger_1.default.error(error);
            throw new apollo_server_express_1.ApolloError(error);
        }
    });
}
exports.changePasswordUser = changePasswordUser;
//# sourceMappingURL=change-password.service.js.map