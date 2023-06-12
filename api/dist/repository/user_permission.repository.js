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
exports.deletePermissionByUserPlanIds = exports.deletePermissionByUserPlanId = exports.insertMultiPermission = exports.userPermissionColumns = void 0;
const database_config_1 = __importDefault(require("~/config/database.config"));
const database_constant_1 = require("~/constants/database.constant");
const format_date_db_1 = __importDefault(require("~/utils/format-date-db"));
const TABLE = database_constant_1.TABLES.userPermissions;
exports.userPermissionColumns = {
    id: 'user_permissions.id',
    userId: 'user_permissions.user_id',
    userPlanId: 'user_permissions.user_plan_id',
    permission: 'user_permissions.permission',
    createAt: 'user_permissions.created_at',
    updatedAt: 'user_permissions.updated_at',
    deletedAt: 'user_permissions.deleted_at',
};
function insertMultiPermission(data, transaction = null) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = (0, database_config_1.default)(TABLE).insert(data);
        if (!transaction) {
            return query;
        }
        return query.transacting(transaction);
    });
}
exports.insertMultiPermission = insertMultiPermission;
function deletePermissionByUserPlanId(userPlanId, dateDeleted = null) {
    const deleteAt = dateDeleted || (0, format_date_db_1.default)();
    return (0, database_config_1.default)(TABLE).where({ [exports.userPermissionColumns.userPlanId]: userPlanId }).update({ deleted_at: deleteAt });
}
exports.deletePermissionByUserPlanId = deletePermissionByUserPlanId;
function deletePermissionByUserPlanIds(userPlanIds) {
    return (0, database_config_1.default)(TABLE).whereIn(exports.userPermissionColumns.userPlanId, userPlanIds).update({ deleted_at: (0, format_date_db_1.default)() });
}
exports.deletePermissionByUserPlanIds = deletePermissionByUserPlanIds;
//# sourceMappingURL=user_permission.repository.js.map