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
exports.trialWillEnd = exports.invoicePaymentFailed = exports.invoicePaymentSuccess = exports.deleteUserPlan = exports.updateUserPlan = exports.createUserPlan = exports.getUserPlan = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const dayjs_1 = __importDefault(require("dayjs"));
const logger_1 = __importDefault(require("~/utils/logger"));
const user_plans_repository_1 = require("~/repository/user_plans.repository");
const subcription_service_1 = require("~/services/stripe/subcription.service");
const products_repository_1 = require("~/repository/products.repository");
const user_permission_repository_1 = require("~/repository/user_permission.repository");
const user_repository_1 = require("~/repository/user.repository");
const format_date_db_1 = __importDefault(require("~/utils/format-date-db"));
const billing_constant_1 = require("~/constants/billing.constant");
const compile_email_template_1 = __importDefault(require("~/helpers/compile-email-template"));
const mail_1 = __importDefault(require("~/libs/mail"));
function getUserPlan(userId) {
    return (0, user_plans_repository_1.getUserPlanByUserId)(userId);
}
exports.getUserPlan = getUserPlan;
function createUserPlan(userId, paymentMethodToken, planName, billingType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield (0, user_repository_1.findUser)({ id: userId });
            if (!user) {
                return new apollo_server_express_1.ApolloError('Can not find any user');
            }
            const product = yield (0, products_repository_1.findProductAndPriceByType)(planName, billingType);
            if (!product) {
                return new apollo_server_express_1.ApolloError('Can not find any plan');
            }
            const userPlan = yield (0, user_plans_repository_1.getUserPlanByUserId)(userId);
            if (userPlan) {
                yield (0, user_plans_repository_1.updateUserPlanById)(userPlan.id, { is_active: false });
                yield (0, user_permission_repository_1.deletePermissionByUserPlanId)(userPlan.id);
            }
            const { subcription_id, customer_id } = yield (0, subcription_service_1.createNewSubcription)(paymentMethodToken, user.email, user.name, product.price_stripe_id);
            if (subcription_id && customer_id) {
                const dataUserPlan = {
                    user_id: userId,
                    product_id: product.id,
                    price_id: product.price_id,
                    customer_id,
                    subcription_id,
                    expired_at: (0, format_date_db_1.default)((0, dayjs_1.default)().add(1, product.price_type === 'yearly' ? 'y' : 'M')),
                };
                const userPlanId = yield (0, user_plans_repository_1.insertUserPlan)(dataUserPlan);
                let userPermissionData;
                if (product.type === 'starter' || product.type === 'professional') {
                    userPermissionData = billing_constant_1.PERMISSION_PLAN[product.type].map((permission) => ({
                        user_id: userId,
                        user_plan_id: userPlanId[0],
                        permission,
                    }));
                }
                yield (0, user_permission_repository_1.insertMultiPermission)(userPermissionData);
            }
            return true;
        }
        catch (error) {
            logger_1.default.error(error);
            throw new apollo_server_express_1.ApolloError('Something went wrong!');
        }
    });
}
exports.createUserPlan = createUserPlan;
function updateUserPlan(userPlanId, planName, billingType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userPlan = yield (0, user_plans_repository_1.getUserPlanById)(userPlanId);
            if (!userPlan) {
                return new apollo_server_express_1.ApolloError('Can not find any user plan');
            }
            const product = yield (0, products_repository_1.findProductAndPriceByType)(planName, billingType);
            if (!product) {
                return new apollo_server_express_1.ApolloError('Can not find any plan');
            }
            yield (0, subcription_service_1.updateSubcription)(userPlan.subcription_id, product.price_stripe_id);
            const dataUserPlan = {
                product_id: product.id,
                price_id: product.price_id,
            };
            if (!userPlan.is_trial) {
                dataUserPlan.expired_at = (0, format_date_db_1.default)((0, dayjs_1.default)().add(1, product.price_type === 'yearly' ? 'y' : 'M'));
            }
            yield (0, user_plans_repository_1.updateUserPlanById)(userPlanId, dataUserPlan);
            let userPermissionData;
            if (product.type === 'starter' || product.type === 'professional') {
                userPermissionData = billing_constant_1.PERMISSION_PLAN[product.type].map((permission) => ({
                    user_id: userPlan.user_id,
                    user_plan_id: userPlanId,
                    permission,
                }));
            }
            yield (0, user_permission_repository_1.deletePermissionByUserPlanId)(userPlanId);
            yield (0, user_permission_repository_1.insertMultiPermission)(userPermissionData);
            return true;
        }
        catch (error) {
            logger_1.default.error(error);
            throw new apollo_server_express_1.ApolloError('Something went wrong!');
        }
    });
}
exports.updateUserPlan = updateUserPlan;
function deleteUserPlan(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userPlan = yield (0, user_plans_repository_1.getUserPlanById)(id);
            if (!userPlan) {
                return new apollo_server_express_1.ApolloError('Can not find any user plan');
            }
            yield (0, subcription_service_1.cancelSubcription)(userPlan.customer_id);
            yield Promise.all([
                (0, user_plans_repository_1.deleteUserPlanById)(userPlan.id),
                (0, user_permission_repository_1.deletePermissionByUserPlanId)(userPlan.id, userPlan.expired_at),
            ]);
            return true;
        }
        catch (error) {
            logger_1.default.error(error);
            throw new apollo_server_express_1.ApolloError('Something went wrong!');
        }
    });
}
exports.deleteUserPlan = deleteUserPlan;
function invoicePaymentSuccess(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userPlan = yield (0, user_plans_repository_1.getUserPlanByCustomerId)(data.customer);
            if (!userPlan) {
                throw new apollo_server_express_1.ApolloError('Can not find any user plan');
            }
            const expiredAt = (0, format_date_db_1.default)((0, dayjs_1.default)().add(1, userPlan.priceType === 'yearly' ? 'y' : 'M'));
            const dataUserPlan = {
                expired_at: expiredAt,
                deleted_at: null,
            };
            yield (0, user_plans_repository_1.updateUserPlanById)(userPlan.id, dataUserPlan);
            const user = yield (0, user_repository_1.findUser)({ id: userPlan.userId });
            if (user) {
                const template = yield (0, compile_email_template_1.default)({
                    fileName: 'invoicePaymentSuccess.mjml',
                    data: {
                        link: data.hosted_invoice_url,
                        name: user.name,
                        date: expiredAt,
                    },
                });
                (0, mail_1.default)(user.email, 'Invoice payment successfully', template);
            }
            return true;
        }
        catch (error) {
            logger_1.default.error(error);
            throw new apollo_server_express_1.ApolloError('Something went wrong!');
        }
    });
}
exports.invoicePaymentSuccess = invoicePaymentSuccess;
function invoicePaymentFailed(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userPlan = yield (0, user_plans_repository_1.getUserPlanByCustomerId)(data.customer);
            if (!userPlan) {
                throw new apollo_server_express_1.ApolloError('Can not find any user plan');
            }
            const expiredAt = (0, format_date_db_1.default)((0, dayjs_1.default)(userPlan.expiredAt).add(10, 'd'));
            const dataUserPlan = {
                expired_at: expiredAt,
                deleted_at: (0, format_date_db_1.default)(),
            };
            yield (0, user_plans_repository_1.updateUserPlanById)(userPlan.id, dataUserPlan);
            const user = yield (0, user_repository_1.findUser)({ id: userPlan.userId });
            if (user) {
                const template = yield (0, compile_email_template_1.default)({
                    fileName: 'invoicePaymentFailed.mjml',
                    data: {
                        name: user.name,
                        date: expiredAt,
                    },
                });
                (0, mail_1.default)(user.email, 'Invoice payment failed', template);
            }
            return true;
        }
        catch (error) {
            logger_1.default.error(error);
            throw new apollo_server_express_1.ApolloError('Something went wrong!');
        }
    });
}
exports.invoicePaymentFailed = invoicePaymentFailed;
function trialWillEnd(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userPlan = yield (0, user_plans_repository_1.getUserPlanByCustomerId)(data.customer);
            if (!userPlan) {
                throw new apollo_server_express_1.ApolloError('Can not find any user plan');
            }
            const user = yield (0, user_repository_1.findUser)({ id: userPlan.userId });
            if (user) {
                const template = yield (0, compile_email_template_1.default)({
                    fileName: 'trialWillEnd.mjml',
                    data: {
                        name: user.name,
                        date: (0, format_date_db_1.default)((0, dayjs_1.default)(data.trial_end * 1000)),
                    },
                });
                (0, mail_1.default)(user.email, 'Trial will end', template);
            }
            return true;
        }
        catch (error) {
            logger_1.default.error(error);
            throw new apollo_server_express_1.ApolloError('Something went wrong!');
        }
    });
}
exports.trialWillEnd = trialWillEnd;
//# sourceMappingURL=plans-user.service.js.map