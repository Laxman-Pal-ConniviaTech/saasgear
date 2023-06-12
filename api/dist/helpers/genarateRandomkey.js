"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const generateRandomKey = () => new Promise((resolve, reject) => {
    (0, crypto_1.randomBytes)(32, (error, buf) => {
        if (error) {
            return reject(error);
        }
        const token = buf.toString('hex');
        return resolve(token);
    });
});
exports.default = generateRandomKey;
//# sourceMappingURL=genarateRandomkey.js.map