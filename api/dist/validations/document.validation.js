"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidation = void 0;
const fastest_validator_1 = __importDefault(require("fastest-validator"));
function createValidation(data) {
    const validator = new fastest_validator_1.default();
    const schema = {
        name: { type: 'string' },
        body: { type: 'string' },
    };
    return validator.validate(data, schema);
}
exports.createValidation = createValidation;
//# sourceMappingURL=document.validation.js.map