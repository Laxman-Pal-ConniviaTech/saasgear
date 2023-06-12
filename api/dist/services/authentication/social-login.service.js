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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSocial = void 0;
const provider_constant_1 = require("~/constants/provider.constant");
const github_login_service_1 = require("./github-login.service");
const facebook_login_service_1 = require("./facebook-login.service");
const google_login_service_1 = require("./google-login.service");
function loginSocial(provider, code) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = null;
        switch (provider) {
            case provider_constant_1.SOCIAL_PROVIDER.github.toUpperCase():
                result = yield (0, github_login_service_1.loginGithub)(code);
                break;
            case provider_constant_1.SOCIAL_PROVIDER.facebook.toUpperCase():
                result = yield (0, facebook_login_service_1.loginFacebook)(code);
                break;
            case provider_constant_1.SOCIAL_PROVIDER.google.toUpperCase():
                result = yield (0, google_login_service_1.loginGoogle)(code);
                break;
            default:
                break;
        }
        return result;
    });
}
exports.loginSocial = loginSocial;
//# sourceMappingURL=social-login.service.js.map