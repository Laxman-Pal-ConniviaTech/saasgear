"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordValidation = exports.registerValidation = exports.loginValidation = void 0;
const fastest_validator_1 = __importDefault(require("fastest-validator"));
function loginValidation(data) {
    const validator = new fastest_validator_1.default();
    const schema = {
        email: { type: 'email' },
        password: { type: 'string', min: 6 },
    };
    return validator.validate(data, schema);
}
exports.loginValidation = loginValidation;
function registerValidation(data) {
    const validator = new fastest_validator_1.default();
    const schema = {
        email: { type: 'email' },
        password: { type: 'string', min: 6 },
        name: { type: 'string', empty: false },
    };
    return validator.validate(data, schema);
}
exports.registerValidation = registerValidation;
function changePasswordValidation(data) {
    const validator = new fastest_validator_1.default();
    const schema = {
        password: {
            type: 'string',
            min: 6,
            max: 50,
            optional: true,
            empty: false,
        },
    };
    return validator.validate(data, schema);
}
exports.changePasswordValidation = changePasswordValidation;
//# sourceMappingURL=authenticate.validation.js.map