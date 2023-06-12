"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserPlanById = exports.getUserPlanByUserId = exports.updateUserPlanById = exports.getUserPlanByCustomerId = exports.getUserPlanExpired = exports.getUserPlanById = exports.insertUserPlan = exports.userPlanColumns = void 0;
const database_config_1 = __importDefault(require("~/config/database.config"));
const database_constant_1 = require("~/constants/database.constant");
const format_date_db_1 = __importDefault(require("~/utils/format-date-db"));
const prices_repository_1 = require("./prices.repository");
const products_repository_1 = require("./products.repository");
const TABLE = database_constant_1.TABLES.userPlans;
exports.userPlanColumns = {
    id: 'user_plans.id',
    userId: 'user_plans.user_id',
    productId: 'user_plans.product_id',
    priceId: 'user_plans.price_id',
    subcriptionId: 'user_plans.subcription_id',
    customerId: 'user_plans.customer_id',
    isTrial: 'user_plans.is_trial',
    expiredAt: 'user_plans.expired_at',
    isActive: 'user_plans.is_active',
    createAt: 'user_plans.created_at',
    updatedAt: 'user_plans.updated_at',
    deletedAt: 'user_plans.deleted_at',
};
function insertUserPlan(data, transaction = null) {
    const query = (0, database_config_1.default)(TABLE).insert(data);
    if (!transaction) {
        return query;
    }
    return query.transacting(transaction);
}
exports.insertUserPlan = insertUserPlan;
function getUserPlanById(id) {
    return (0, database_config_1.default)(TABLE)
        .where({ id, [exports.userPlanColumns.isActive]: true })
        .where(exports.userPlanColumns.expiredAt, '>=', (0, format_date_db_1.default)())
        .first();
}
exports.getUserPlanById = getUserPlanById;
function getUserPlanExpired() {
    return (0, database_config_1.default)(TABLE)
        .whereNotNull(exports.userPlanColumns.deletedAt)
        .where(exports.userPlanColumns.expiredAt, '<', (0, format_date_db_1.default)());
}
exports.getUserPlanExpired = getUserPlanExpired;
function getUserPlanByCustomerId(customerId) {
    return (0, database_config_1.default)(TABLE)
        .leftJoin(database_constant_1.TABLES.prices, exports.userPlanColumns.priceId, prices_repository_1.priceColumns.id)
        .select(exports.userPlanColumns, `${prices_repository_1.priceColumns.type} as priceType`)
        .where({ [exports.userPlanColumns.customerId]: customerId, [exports.userPlanColumns.isActive]: true })
        .first();
}
exports.getUserPlanByCustomerId = getUserPlanByCustomerId;
function updateUserPlanById(id, data) {
    return (0, database_config_1.default)(TABLE).where({ id }).update(data);
}
exports.updateUserPlanById = updateUserPlanById;
function getUserPlanByUserId(userId) {
    return (0, database_config_1.default)(TABLE)
        .leftJoin(database_constant_1.TABLES.products, exports.userPlanColumns.productId, products_repository_1.productColumns.id)
        .leftJoin(database_constant_1.TABLES.prices, exports.userPlanColumns.priceId, prices_repository_1.priceColumns.id)
        .select(exports.userPlanColumns, products_repository_1.productColumns.name, `${products_repository_1.productColumns.type} as productType`, prices_repository_1.priceColumns.amount, `${prices_repository_1.priceColumns.type} as priceType`)
        .where({ [exports.userPlanColumns.userId]: userId, [exports.userPlanColumns.isActive]: true })
        .where(exports.userPlanColumns.expiredAt, '>=', (0, format_date_db_1.default)())
        .first();
}
exports.getUserPlanByUserId = getUserPlanByUserId;
function deleteUserPlanById(id) {
    return (0, database_config_1.default)(TABLE).where({ id }).update({ [exports.userPlanColumns.deletedAt]: (0, format_date_db_1.default)() });
}
exports.deleteUserPlanById = deleteUserPlanById;
//# sourceMappingURL=user_plans.repository.js.map