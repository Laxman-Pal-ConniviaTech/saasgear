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
exports.forgotPasswordUser = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const user_repository_1 = require("~/repository/user.repository");
const genarateRandomkey_1 = __importDefault(require("~/helpers/genarateRandomkey"));
const user_tokens_repository_1 = require("~/repository/user_tokens.repository");
const logger_1 = __importDefault(require("~/utils/logger"));
const mail_1 = __importDefault(require("~/libs/mail"));
const compile_email_template_1 = __importDefault(require("~/helpers/compile-email-template"));
const send_mail_type_constant_1 = require("~/constants/send-mail-type.constant");
function forgotPasswordUser(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield (0, user_repository_1.findUser)({ email });
            if (!user || !user.id) {
                return true;
            }
            let session = yield (0, user_repository_1.getUserByIdAndJoinUserToken)(user.id, send_mail_type_constant_1.SEND_MAIL_TYPE.FORGOT_PASSWORD);
            const tokenGenerated = yield (0, genarateRandomkey_1.default)();
            const token = `${tokenGenerated}-${user.id}`;
            if (!session) {
                yield (0, user_tokens_repository_1.createToken)(user.id, token, send_mail_type_constant_1.SEND_MAIL_TYPE.FORGOT_PASSWORD);
                session = {
                    name: user.name,
                    email: user.email,
                };
            }
            else {
                yield (0, user_tokens_repository_1.updateUserTokenById)(session.id, token);
            }
            const template = yield (0, compile_email_template_1.default)({
                fileName: 'forgotPassword.mjml',
                data: {
                    name: session.name,
                    url: `${process.env.FRONTEND_URL}/auth/reset-password?&token=${token}`,
                },
            });
            yield (0, mail_1.default)(session.email, 'Reset Password from SaaSgear', template);
            return true;
        }
        catch (error) {
            logger_1.default.error(error);
            throw new apollo_server_express_1.ApolloError(error);
        }
    });
}
exports.forgotPasswordUser = forgotPasswordUser;
//# sourceMappingURL=forgot-password.service.js.map