"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const dotenv_1 = __importDefault(require("dotenv"));
const knexfile_1 = __importDefault(require("./knexfile"));
dotenv_1.default.config({ path: '.env' });
exports.default = (0, knex_1.default)((0, knexfile_1.default)(process.env.DATABASE_NAME, process.env.DATABASE_HOST, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, Number(process.env.DATABASE_PORT)));
//# sourceMappingURL=database.config.js.map