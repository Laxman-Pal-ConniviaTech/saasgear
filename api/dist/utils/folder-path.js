"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATHS = exports.FOLDER_PATHS = void 0;
const path_1 = require("path");
exports.FOLDER_PATHS = {
    avatarDir: (0, path_1.join)((0, path_1.resolve)(), 'public', 'uploads', 'avatars'),
};
exports.PATHS = {
    avatarDir: 'avatars',
};
//# sourceMappingURL=folder-path.js.map