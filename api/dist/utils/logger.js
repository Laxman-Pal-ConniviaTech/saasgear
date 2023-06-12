"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan_1 = __importDefault(require("bunyan"));
const fs_1 = __importDefault(require("fs"));
fs_1.default.existsSync('logs') || fs_1.default.mkdirSync('logs');
const logger = bunyan_1.default.createLogger({
    name: 'jsl-sassgear',
    streams: [
        {
            type: 'rotating-file',
            path: 'logs/info.log',
            period: '1d',
            level: 'info',
            count: 3,
        },
        {
            type: 'rotating-file',
            path: 'logs/error.log',
            period: '1d',
            level: 'error',
            count: 7,
        },
        {
            type: 'rotating-file',
            path: 'logs/trace.log',
            period: '1d',
            level: 'trace',
            count: 3,
        },
    ],
});
exports.default = logger;
//# sourceMappingURL=logger.js.map