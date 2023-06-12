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
exports.resendEmailAction = exports.verifyEmail = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const dayjs_1 = __importDefault(require("dayjs"));
const user_tokens_repository_1 = require("~/repository/user_tokens.repository");
const user_repository_1 = require("~/repository/user.repository");
const genarateRandomkey_1 = __importDefault(require("~/helpers/genarateRandomkey"));
const compile_email_template_1 = __importDefault(require("~/helpers/compile-email-template"));
const mail_1 = __importDefault(require("~/libs/mail"));
const logger_1 = __importDefault(require("~/utils/logger"));
const string_helper_1 = require("~/helpers/string.helper");
const send_mail_type_constant_1 = require("~/constants/send-mail-type.constant");
function isValidDate(createdAt) {
    return (0, dayjs_1.default)(createdAt).add(15, 'minute').diff((0, dayjs_1.default)()) > 0;
}
function verifyEmail(authToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = yield (0, user_tokens_repository_1.findToken)(authToken);
            if (!token || !token.is_active || token.type !== send_mail_type_constant_1.SEND_MAIL_TYPE.VERIFY_EMAIL) {
                return new apollo_server_express_1.ApolloError('Invalid token');
            }
            if (!isValidDate(token.created_at)) {
                return new apollo_server_express_1.ApolloError('Token had expired');
            }
            yield Promise.all([(0, user_tokens_repository_1.changeTokenStatus)(token.id, token.type, false), (0, user_repository_1.activeUser)(token.user_id)]);
            return true;
        }
        catch (error) {
            logger_1.default.error(error);
            throw error;
        }
    });
}
exports.verifyEmail = verifyEmail;
function resendEmailAction(user, type) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let template;
            let subject;
            const token = yield (0, genarateRandomkey_1.default)();
            switch (type) {
                case send_mail_type_constant_1.SEND_MAIL_TYPE.VERIFY_EMAIL:
                    if (user.is_active) {
                        throw new apollo_server_express_1.ApolloError('Account verified');
                    }
                    subject = 'Resend confirm your email address';
                    template = yield (0, compile_email_template_1.default)({
                        fileName: 'verifyEmail.mjml',
                        data: {
                            name: user.name,
                            url: `${process.env.FRONTEND_URL}/verify-email?token=${token}`,
                        },
                    });
                    break;
                case send_mail_type_constant_1.SEND_MAIL_TYPE.FORGOT_PASSWORD:
                    subject = 'Resend reset password';
                    template = yield (0, compile_email_template_1.default)({
                        fileName: 'forgotPassword.mjml',
                        data: {
                            name: user.name,
                            url: `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`,
                        },
                    });
                    break;
                default:
                    subject = 'Resend confirm your email address';
                    template = yield (0, compile_email_template_1.default)({
                        fileName: 'verifyEmail.mjml',
                        data: {
                            name: user.name,
                            url: `${process.env.FRONTEND_URL}/verify-email?token=${token}`,
                        },
                    });
                    break;
            }
            yield (0, user_tokens_repository_1.changeTokenStatus)(null, type, false);
            yield Promise.all([(0, user_tokens_repository_1.createToken)(user.id, token, type), (0, mail_1.default)((0, string_helper_1.normalizeEmail)(user.email), subject, template)]);
            return true;
        }
        catch (error) {
            logger_1.default.error(error);
            throw error;
        }
    });
}
exports.resendEmailAction = resendEmailAction;
//# sourceMappingURL=verify-email.service.js.map