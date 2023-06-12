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
exports.activeUser = exports.getUserByIdAndJoinUserToken = exports.updateUser = exports.createUser = exports.findUser = exports.usersColumns = void 0;
const union_1 = __importDefault(require("lodash/union"));
const database_config_1 = __importDefault(require("~/config/database.config"));
const user_tokens_repository_1 = require("./user_tokens.repository");
const database_constant_1 = require("~/constants/database.constant");
const user_plans_repository_1 = require("./user_plans.repository");
const user_permission_repository_1 = require("./user_permission.repository");
const billing_constant_1 = require("~/constants/billing.constant");
const TABLE = database_constant_1.TABLES.users;
exports.usersColumns = {
    id: 'users.id',
    name: 'users.name',
    email: 'users.email',
    createAt: 'users.created_at',
    updatedAt: 'users.updated_at',
    isActive: 'users.is_active',
    position: 'users.position',
    company: 'users.company',
    avatarUrl: 'users.avatar_url',
    provider: 'users.provider',
    providerId: 'users.provider_id',
    deletedAt: 'users.deleted_at',
};
function findUser({ id, email, provider_id, provider, deleted_at = null }) {
    return __awaiter(this, void 0, void 0, function* () {
        const condition = {
            deleted_at,
        };
        if (id)
            condition.id = id;
        if (email)
            condition.email = email;
        if (provider_id)
            condition.provider_id = provider_id;
        if (provider)
            condition.provider = provider;
        return (0, database_config_1.default)(TABLE).where(condition).first();
    });
}
exports.findUser = findUser;
function createUser(userData, userPlanData = null, planType = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let t;
        try {
            t = yield database_config_1.default.transaction();
            const [userId] = yield (0, database_config_1.default)(TABLE).transacting(t).insert(userData);
            if (userPlanData) {
                const [userPlanId] = yield (0, user_plans_repository_1.insertUserPlan)(Object.assign(Object.assign({}, userPlanData), { user_id: userId }), t);
                if (planType && billing_constant_1.PERMISSION_PLAN[planType]) {
                    const userPermissionData = billing_constant_1.PERMISSION_PLAN[planType].map((permission) => ({
                        user_id: userId,
                        user_plan_id: userPlanId,
                        permission,
                    }));
                    yield (0, user_permission_repository_1.insertMultiPermission)(userPermissionData, t);
                }
            }
            yield t.commit();
            return userId;
        }
        catch (error) {
            if (error)
                t.rollback();
            return new Error(error);
        }
    });
}
exports.createUser = createUser;
function updateUser(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, database_config_1.default)(TABLE).where({ id }).update(data);
    });
}
exports.updateUser = updateUser;
function getUserByIdAndJoinUserToken(id, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = Object.values(exports.usersColumns);
        const userToken = Object.values(user_tokens_repository_1.userTokenColumns);
        return (0, database_config_1.default)(TABLE)
            .join(database_constant_1.TABLES.userTokens, exports.usersColumns.id, user_tokens_repository_1.userTokenColumns.userId)
            .select((0, union_1.default)(users, userToken))
            .where({ [exports.usersColumns.id]: id, [user_tokens_repository_1.userTokenColumns.type]: type })
            .first();
    });
}
exports.getUserByIdAndJoinUserToken = getUserByIdAndJoinUserToken;
function activeUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, database_config_1.default)(TABLE).where({ id }).update({ is_active: true });
    });
}
exports.activeUser = activeUser;
//# sourceMappingURL=user.repository.js.map