"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
function formatDateDB(date = null) {
    let dateFormat = (0, dayjs_1.default)();
    if (date) {
        dateFormat = (0, dayjs_1.default)(date);
    }
    return dateFormat.format('YYYY-MM-DD HH:mm:ss');
}
exports.default = formatDateDB;
//# sourceMappingURL=format-date-db.js.map