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
exports.deleteUser = void 0;
const user_plans_repository_1 = require("~/repository/user_plans.repository");
// import { cancelSubcription } from '~/services/stripe/subcription.service';
const user_tokens_repository_1 = require("~/repository/user_tokens.repository");
const database_config_1 = __importDefault(require("~/config/database.config"));
const database_constant_1 = require("~/constants/database.constant");
function deleteUser(currentUser) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokens = yield (0, user_tokens_repository_1.getToken)({ user_id: currentUser.id });
        const userPlan = yield (0, user_plans_repository_1.getUserPlanByUserId)(currentUser.id);
        const activeTokens = tokens.filter((token) => token.is_active);
        const pms = [disableAllField(currentUser, activeTokens)];
        if (userPlan) {
            //  TODO CANCEL SUBCRIPTION
        }
        yield Promise.all(pms);
        return true;
    });
}
exports.deleteUser = deleteUser;
function disableAllField(user, tokens, userPlan = null) {
    return database_config_1.default.transaction((trx) => {
        const queries = [];
        queries.push((0, database_config_1.default)(database_constant_1.TABLES.users).where({ id: user.id }).update({ deleted_at: new Date() }).transacting(trx));
        if (tokens.length > 0) {
            tokens.forEach((token) => {
                queries.push((0, database_config_1.default)(database_constant_1.TABLES.userTokens).where({ id: token.id }).update({ is_active: false }).transacting(trx));
            });
        }
        if (userPlan) {
            //  TODO DELETE USERPLAIN
        }
        Promise.all(queries).then(trx.commit).catch(trx.rollback);
    });
}
//# sourceMappingURL=delete-user.service.js.map