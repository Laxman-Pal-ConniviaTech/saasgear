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
const mailgun_js_1 = __importDefault(require("mailgun-js"));
const node_1 = __importDefault(require("@sentry/node"));
const mailgun = (0, mailgun_js_1.default)({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
});
function sendMail(to, subject, html) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            mailgun.messages().send({
                from: process.env.MAILGUN_DEFAULT_TO_EMAIL,
                to,
                subject,
                html,
            });
            return true;
        }
        catch (error) {
            node_1.default.captureException(error);
            return true;
        }
    });
}
exports.default = sendMail;
//# sourceMappingURL=mail.js.map