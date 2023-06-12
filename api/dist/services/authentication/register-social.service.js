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
exports.registerAccountBySocial = void 0;
const apollo_server_express_1 = __importDefault(require("apollo-server-express"));
const user_repository_1 = require("~/repository/user.repository");
const genarateRandomkey_1 = __importDefault(require("~/helpers/genarateRandomkey"));
const user_tokens_repository_1 = require("~/repository/user_tokens.repository");
const compile_email_template_1 = __importDefault(require("~/helpers/compile-email-template"));
const mail_1 = __importDefault(require("~/libs/mail"));
const jwt_helper_1 = require("~/helpers/jwt.helper");
const send_mail_type_constant_1 = require("~/constants/send-mail-type.constant");
function registerAccountBySocial(provider, email, name, avatarUrl, providerId) {
    return __awaiter(this, void 0, void 0, function* () {
        const existEmail = yield (0, user_repository_1.findUser)({ email });
        if (existEmail) {
            throw new apollo_server_express_1.default.ApolloError('Email address has been used');
        }
        const userId = yield (0, user_repository_1.createUser)({
            provider: provider.toLowerCase(),
            provider_id: providerId,
            name,
            avatar_url: avatarUrl,
            email,
        });
        const tokenVerifyEmail = yield (0, genarateRandomkey_1.default)();
        const template = yield (0, compile_email_template_1.default)({
            fileName: 'verifyEmail.mjml',
            data: {
                name,
                url: `${process.env.FRONTEND_URL}/verify-email?token=${tokenVerifyEmail}`,
            },
        });
        if (typeof userId === 'number') {
            yield Promise.all([(0, mail_1.default)(email, 'Confirm your email address', template), (0, user_tokens_repository_1.createToken)(userId, tokenVerifyEmail, send_mail_type_constant_1.SEND_MAIL_TYPE.VERIFY_EMAIL)]);
        }
        return {
            token: (0, jwt_helper_1.sign)({
                email,
                name,
            }),
        };
    });
}
exports.registerAccountBySocial = registerAccountBySocial;
//# sourceMappingURL=register-social.service.js.map