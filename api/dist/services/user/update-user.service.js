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
exports.changeUserAvatar = exports.updateProfile = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const apollo_server_express_1 = require("apollo-server-express");
const user_repository_1 = require("~/repository/user.repository");
const logger_1 = __importDefault(require("~/utils/logger"));
const folder_path_1 = require("~/utils/folder-path");
function updateProfile(id, name, company, position) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield (0, user_repository_1.findUser)({ id });
            if (!user) {
                return new apollo_server_express_1.ApolloError('Can not find any user');
            }
            yield (0, user_repository_1.updateUser)(id, { name, position, company });
            return true;
        }
        catch (error) {
            logger_1.default.error(error);
            throw new apollo_server_express_1.ApolloError('Something went wrong!');
        }
    });
}
exports.updateProfile = updateProfile;
function changeUserAvatar(fileData, user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const file = yield fileData;
            const fileName = `avatar-${user.id}-new-${new Date().getTime()}-${file.filename}`;
            const stream = file.createReadStream();
            yield new Promise((resolve, reject) => {
                const writeStream = (0, fs_1.createWriteStream)((0, path_1.join)(folder_path_1.FOLDER_PATHS.avatarDir, fileName));
                writeStream.on('finish', () => resolve());
                writeStream.on('error', (error) => __awaiter(this, void 0, void 0, function* () { return reject(error); }));
                stream.on('error', (error) => writeStream.destroy(error));
                stream.pipe(writeStream);
            });
            yield (0, user_repository_1.updateUser)(user.id, { avatar_url: fileName });
            return { url: fileName };
        }
        catch (error) {
            logger_1.default.error(error);
            throw new apollo_server_express_1.ApolloError('Something went wrong!');
        }
    });
}
exports.changeUserAvatar = changeUserAvatar;
//# sourceMappingURL=update-user.service.js.map