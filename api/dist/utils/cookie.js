"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCookie = exports.setAuthenticationCookie = exports.COOKIE_NAME = void 0;
exports.COOKIE_NAME = {
    TOKEN: 'token',
};
function setAuthenticationCookie(res, token) {
    res.cookie(exports.COOKIE_NAME.TOKEN, `Bearer ${token}`, { maxAge: 60 * 60 * 24 * 1000, httpOnly: true });
}
exports.setAuthenticationCookie = setAuthenticationCookie;
function clearCookie(res, key) {
    res.clearCookie(key);
}
exports.clearCookie = clearCookie;
//# sourceMappingURL=cookie.js.map