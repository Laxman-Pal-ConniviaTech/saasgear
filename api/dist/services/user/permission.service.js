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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMultiPermissions = void 0;
// import { getUserByIdAndJoinUserToken } from '~/repository/user.repository';
const user_permission_repository_1 = require("~/repository/user_permission.repository");
/**
 * Add user permission
 *
 * @param {number} userId
 * @param {array} permissions
 *
 * @returns {Promise<any>}
 */
function addMultiPermissions(userId, permissions) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = permissions.map((permission) => ({
            user_id: userId,
            permission,
        }));
        return (0, user_permission_repository_1.insertMultiPermission)(data);
    });
}
exports.addMultiPermissions = addMultiPermissions;
//# sourceMappingURL=permission.service.js.map