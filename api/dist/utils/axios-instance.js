"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
exports.default = axios_1.default.create({
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});
//# sourceMappingURL=axios-instance.js.map