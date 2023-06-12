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
const logger_1 = __importDefault(require("~/utils/logger"));
const plans_user_service_1 = require("../user/plans-user.service");
function webhookStripe(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let event;
        try {
            event = JSON.parse(req.body);
        }
        catch (err) {
            logger_1.default.error(err);
            res.status(400).send(`Webhook Error: ${err.message}`);
        }
        switch (event.type) {
            case 'invoice.payment_succeeded':
                (0, plans_user_service_1.invoicePaymentSuccess)(event.data.object);
                break;
            case 'invoice.payment_failed':
                (0, plans_user_service_1.invoicePaymentFailed)(event.data.object);
                break;
            case 'customer.subscription.trial_will_end':
                (0, plans_user_service_1.trialWillEnd)(event.data.object);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        res.json({ received: true });
    });
}
exports.default = webhookStripe;
//# sourceMappingURL=webhooks.servive.js.map