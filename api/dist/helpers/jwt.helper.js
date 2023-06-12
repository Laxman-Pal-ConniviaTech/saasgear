"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.sign = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { sign: jwtSign, verify: jwtVerify } = jsonwebtoken_1.default;
const signOptions = {
    issuer: process.env.JWT_ISSUER,
    subject: process.env.JWT_SUBJECT,
    audience: process.env.JWT_AUDIENCE,
    expiresIn: process.env.JWT_EXPIRESIN,
    algorithm: process.env.JWT_ALGORITHM,
};
function sign(payload) {
    return jwtSign({ user: payload }, process.env.JWT_SECRET, signOptions);
}
exports.sign = sign;
function verify(token) {
    return jwtVerify(token, process.env.JWT_SECRET, signOptions);
}
exports.verify = verify;
//# sourceMappingURL=jwt.helper.js.map