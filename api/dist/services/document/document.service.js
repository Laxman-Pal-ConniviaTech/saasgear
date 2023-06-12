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
exports.deleteDocument = exports.updateDocument = exports.getDocumentDetail = exports.getDocuments = exports.createDocument = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const logger_1 = __importDefault(require("~/utils/logger"));
const documents_repository_1 = require("~/repository/documents.repository");
const document_validation_1 = require("~/validations/document.validation");
/**
 * Create Document
 *
 * @param {number} userId
 * @param {string} name
 * @param {string} body
 */
function createDocument(userId, name, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const validateResult = (0, document_validation_1.createValidation)({ name, body });
        if (Array.isArray(validateResult) && validateResult.length) {
            throw new apollo_server_express_1.ValidationError(validateResult.map((it) => it.message).join(','));
        }
        try {
            const data = yield (0, documents_repository_1.insertDocument)({ name, body, user_id: userId });
            const newDocumentId = data.shift();
            const document = yield (0, documents_repository_1.findDocumentById)(newDocumentId);
            return document;
        }
        catch (error) {
            logger_1.default.error(error);
            throw error;
        }
    });
}
exports.createDocument = createDocument;
/**
 * Get List Documents
 *
 * @param {number} offset
 * @param {number} limit
 *
 */
function getDocuments(userId, offset, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [documents, { count }] = yield (0, documents_repository_1.findDocuments)(userId, offset, limit);
            return {
                documents,
                count,
            };
        }
        catch (error) {
            logger_1.default.error(error);
            throw error;
        }
    });
}
exports.getDocuments = getDocuments;
/**
 * Get Document Detail
 *
 * @param {number} id
 *
 */
function getDocumentDetail(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const document = yield (0, documents_repository_1.findDocumentById)(id);
            return document;
        }
        catch (error) {
            logger_1.default.error(error);
            throw error;
        }
    });
}
exports.getDocumentDetail = getDocumentDetail;
/**
 * Update Document
 *
 * @export
 * @param {number} id
 * @param {string} name
 * @param {string} body
 */
function updateDocument(id, name, body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const document = yield (0, documents_repository_1.findDocumentById)(id);
            if (!document) {
                return new apollo_server_express_1.ApolloError('Can not find any document');
            }
            yield (0, documents_repository_1.updateDocumentById)(id, { name, body });
            return Object.assign(Object.assign({}, document), { name,
                body });
        }
        catch (error) {
            logger_1.default.error(error);
            throw error;
        }
    });
}
exports.updateDocument = updateDocument;
/**
 * Delete Document
 *
 * @param {*} id
 */
function deleteDocument(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const document = yield (0, documents_repository_1.findDocumentById)(id);
            if (!document) {
                return new apollo_server_express_1.ApolloError('Can not find any document');
            }
            yield (0, documents_repository_1.deleteDocumentById)(id);
            return true;
        }
        catch (error) {
            logger_1.default.error(error);
            throw error;
        }
    });
}
exports.deleteDocument = deleteDocument;
//# sourceMappingURL=document.service.js.map