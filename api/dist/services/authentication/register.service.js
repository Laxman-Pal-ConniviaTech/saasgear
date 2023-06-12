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
exports.registerUser = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const dayjs_1 = __importDefault(require("dayjs"));
const user_repository_1 = require("~/repository/user.repository");
const user_tokens_repository_1 = require("~/repository/user_tokens.repository");
const hashing_helper_1 = require("~/helpers/hashing.helper");
const compile_email_template_1 = __importDefault(require("~/helpers/compile-email-template"));
const genarateRandomkey_1 = __importDefault(require("~/helpers/genarateRandomkey"));
const mail_1 = __importDefault(require("~/libs/mail"));
const authenticate_validation_1 = require("~/validations/authenticate.validation");
const logger_1 = __importDefault(require("~/utils/logger"));
const jwt_helper_1 = require("~/helpers/jwt.helper");
const products_repository_1 = require("~/repository/products.repository");
const subcription_service_1 = require("~/services/stripe/subcription.service");
const send_mail_type_constant_1 = require("~/constants/send-mail-type.constant");
const format_date_db_1 = __importDefault(require("~/utils/format-date-db"));
function registerUser(email, password, name, paymentMethodToken, planName, billingType) {
    return __awaiter(this, void 0, void 0, function* () {
        const validateResult = (0, authenticate_validation_1.registerValidation)({ email, password, name });
        if (Array.isArray(validateResult) && validateResult.length) {
            throw new apollo_server_express_1.ValidationError(validateResult.map((it) => it.message).join(','));
        }
        try {
            const user = yield (0, user_repository_1.findUser)({ email });
            if (user) {
                return new apollo_server_express_1.ApolloError('Email address has been used');
            }
            if (user && !user.is_active) {
                return new apollo_server_express_1.ApolloError('Your account is not yet verify');
            }
            const passwordHashed = yield (0, hashing_helper_1.generatePassword)(password);
            const userData = {
                email,
                password: passwordHashed,
                name,
            };
            let newUserId = null;
            if (planName) {
                const product = yield (0, products_repository_1.findProductAndPriceByType)(planName, billingType);
                if (!product) {
                    return new apollo_server_express_1.ApolloError('Can not find any plan');
                }
                const { subcription_id, customer_id } = yield (0, subcription_service_1.createNewSubcription)(paymentMethodToken, email, name, product.price_stripe_id, true);
                if (subcription_id && customer_id) {
                    const userPlanData = {
                        product_id: product.id,
                        price_id: product.price_id,
                        customer_id,
                        subcription_id,
                        is_trial: true,
                        expired_at: (0, format_date_db_1.default)((0, dayjs_1.default)().add(14, 'd')),
                    };
                    if (product.type === 'starter' || product.type === 'professional') {
                        newUserId = yield (0, user_repository_1.createUser)(userData, userPlanData, product.type);
                    }
                }
            }
            else {
                newUserId = yield (0, user_repository_1.createUser)(userData);
            }
            const tokenVerifyEmail = yield (0, genarateRandomkey_1.default)();
            const template = yield (0, compile_email_template_1.default)({
                fileName: 'verifyEmail.mjml',
                data: {
                    name,
                    url: `${process.env.FRONTEND_URL}/verify-email?token=${tokenVerifyEmail}`,
                },
            });
            if (typeof newUserId === 'number') {
                yield Promise.all([
                    (0, mail_1.default)(email, 'Confirm your email address', template),
                    (0, user_tokens_repository_1.createToken)(newUserId, tokenVerifyEmail, send_mail_type_constant_1.SEND_MAIL_TYPE.VERIFY_EMAIL),
                ]);
            }
            const token = (0, jwt_helper_1.sign)({ email, name });
            return { token };
        }
        catch (error) {
            logger_1.default.error(error);
            throw error;
        }
    });
}
exports.registerUser = registerUser;
//# sourceMappingURL=register.service.js.map