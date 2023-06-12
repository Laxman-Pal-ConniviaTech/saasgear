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
exports.cancelSubcription = exports.updateSubcription = exports.createNewSubcription = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const dayjs_1 = __importDefault(require("dayjs"));
const stripe_1 = __importDefault(require("stripe"));
const logger_1 = __importDefault(require("~/utils/logger"));
const string_helper_1 = require("~/helpers/string.helper");
const stripe = new stripe_1.default(process.env.STRIPE_PRIVATE_KEY, {
    apiVersion: '2020-08-27',
});
/**
 * Create new subcription
 *
 * @param {string} token
 * @param {string} email
 * @param {string} name
 * @param {string} priceId
 * @param {boolean} isTrial
 *
 * @returns {Promise<any>}
 */
function createNewSubcription(token, email, name, priceId, isTrial = false) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!token) {
            throw new apollo_server_express_1.ApolloError('Invalid token');
        }
        try {
            const customer = yield stripe.customers.create({
                email: (0, string_helper_1.normalizeEmail)(email),
                name,
                source: token,
            });
            const dataSubcription = {
                customer: customer.id,
                items: [{ price: priceId }],
            };
            if (isTrial) {
                dataSubcription.trial_end = (0, dayjs_1.default)().add(14, 'd').unix();
            }
            const result = yield stripe.subscriptions.create(dataSubcription);
            return {
                customer_id: customer.id,
                subcription_id: result.id,
            };
        }
        catch (error) {
            logger_1.default.error(error);
            throw new apollo_server_express_1.ApolloError('Payment failed! Please check your card.');
        }
    });
}
exports.createNewSubcription = createNewSubcription;
/**
 * Update subcription
 *
 * @param {string} subId
 * @param {string} priceId
 *
 * @returns {Promise<any>}
 */
function updateSubcription(subId, priceId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const subscription = yield stripe.subscriptions.retrieve(subId);
            yield stripe.subscriptions.update(subId, {
                items: [{
                        id: subscription.items.data[0].id,
                        price: priceId,
                    }],
            });
            return true;
        }
        catch (error) {
            logger_1.default.error(error);
            throw new apollo_server_express_1.ApolloError('Payment failed! Please check your card.');
        }
    });
}
exports.updateSubcription = updateSubcription;
/**
 * Cancel subcription
 *
 * @param {string} customerId
 *
 * @returns {Promise<any>}
 */
function cancelSubcription(customerId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield stripe.customers.del(customerId);
            return true;
        }
        catch (error) {
            logger_1.default.error(error);
            throw new apollo_server_express_1.ApolloError('Something went wrong!');
        }
    });
}
exports.cancelSubcription = cancelSubcription;
//# sourceMappingURL=subcription.service.js.map