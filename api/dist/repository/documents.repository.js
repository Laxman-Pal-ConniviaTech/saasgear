"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocumentById = exports.updateDocumentById = exports.findDocuments = exports.findDocumentById = exports.insertDocument = exports.documentColumns = void 0;
const database_config_1 = __importDefault(require("~/config/database.config"));
const database_constant_1 = require("~/constants/database.constant");
const format_date_db_1 = __importDefault(require("~/utils/format-date-db"));
const user_repository_1 = require("./user.repository");
const TABLE = database_constant_1.TABLES.documents;
exports.documentColumns = {
    id: 'documents.id',
    name: 'documents.name',
    body: 'documents.body',
    userId: 'documents.user_id',
    createdAt: 'documents.created_at',
    updatedAt: 'documents.updated_at',
    deletedAt: 'documents.deleted_at',
};
/**
 * Insert Document
 *
 * @param {object} data
 *
 * @returns {Array}
 */
function insertDocument(data) {
    return (0, database_config_1.default)(TABLE).insert(data);
}
exports.insertDocument = insertDocument;
/**
 * Find Document By Id
 *
 * @param {number} id
 *
 * @return {object}
 */
function findDocumentById(id) {
    return (0, database_config_1.default)(TABLE)
        .join(database_constant_1.TABLES.users, exports.documentColumns.userId, user_repository_1.usersColumns.id)
        .select(exports.documentColumns, `${user_repository_1.usersColumns.name} as createdBy`)
        .where({ [exports.documentColumns.id]: id })
        .whereNull(exports.documentColumns.deletedAt)
        .first();
}
exports.findDocumentById = findDocumentById;
/**
 * Find Documents
 *
 * @export
 * @param {number} offset
 * @param {number} limit
 *
 */
function findDocuments(userId, offset = 0, limit = database_constant_1.DEFAULT_LIMIT) {
    return Promise.all([
        (0, database_config_1.default)(TABLE)
            .join(database_constant_1.TABLES.users, exports.documentColumns.userId, user_repository_1.usersColumns.id)
            .select(exports.documentColumns, `${user_repository_1.usersColumns.name} as createdBy`)
            .where(exports.documentColumns.userId, userId)
            .whereNull(exports.documentColumns.deletedAt)
            .limit(limit)
            .offset(offset),
        (0, database_config_1.default)(TABLE).count({ count: '*' }).whereNull(exports.documentColumns.deletedAt).first(),
    ]);
}
exports.findDocuments = findDocuments;
/**
 * Update Document By Id
 *
 * @param {number} id
 * @param {object} data
 *
 */
function updateDocumentById(id, data) {
    return (0, database_config_1.default)(TABLE).where({ [exports.documentColumns.id]: id }).update(data);
}
exports.updateDocumentById = updateDocumentById;
function deleteDocumentById(id) {
    return (0, database_config_1.default)(TABLE).where({ [exports.documentColumns.id]: id }).update({ [exports.documentColumns.deletedAt]: (0, format_date_db_1.default)() });
}
exports.deleteDocumentById = deleteDocumentById;
//# sourceMappingURL=documents.repository.js.map