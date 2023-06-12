"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(process.cwd(), 'logs', `${env}.log`), { flags: 'a' });
exports.default = accessLogStream;
//# sourceMappingURL=logger.middleware.js.map