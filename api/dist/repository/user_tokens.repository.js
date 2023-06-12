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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = exports.removeUserToken = exports.changeTokenStatus = exports.findToken = exports.updateUserTokenById = exports.createToken = exports.userTokenColumns = void 0;
const database_config_1 = __importDefault(require("~/config/database.config"));
const database_constant_1 = require("~/constants/database.constant");
const TABLE = database_constant_1.TABLES.userTokens;
exports.userTokenColumns = {
    id: 'user_tokens.id',
    userId: 'user_tokens.user_id',
    token: 'user_tokens.token',
    type: 'user_tokens.type',
    isActive: 'user_tokens.is_active',
    createAt: 'users.created_at',
    updatedAt: 'users.updated_at',
};
function createToken(userId, token, type) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, database_config_1.default)(TABLE).insert({ token, type, user_id: userId });
    });
}
exports.createToken = createToken;
function updateUserTokenById(id, token) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, database_config_1.default)(TABLE).where({ id }).update({ token });
    });
}
exports.updateUserTokenById = updateUserTokenById;
function findToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, database_config_1.default)(TABLE).where({ token }).first();
    });
}
exports.findToken = findToken;
function changeTokenStatus(id, type, isActive = true) {
    return __awaiter(this, void 0, void 0, function* () {
        const condition = { type };
        if (id)
            condition.id = id;
        return (0, database_config_1.default)(TABLE).where(condition).update({ is_active: isActive });
    });
}
exports.changeTokenStatus = changeTokenStatus;
function removeUserToken(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, database_config_1.default)(TABLE).where({ id }).delete();
    });
}
exports.removeUserToken = removeUserToken;
function getToken({ user_id }) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, database_config_1.default)(TABLE).where({ user_id });
    });
}
exports.getToken = getToken;
//# sourceMappingURL=user_tokens.repository.js.map