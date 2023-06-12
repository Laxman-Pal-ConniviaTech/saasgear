"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: '../.env' });
exports.default = (database, host, user, password, port) => ({
    client: 'mysql2',
    connection: {
        database: database || process.env.DATABASE_NAME,
        host: host || process.env.DATABASE_HOST,
        user: user || process.env.DATABASE_USER,
        password: password || process.env.DATABASE_PASSWORD,
        port: port || Number(process.env.DATABASE_PORT),
    },
    migrations: {
        tableName: 'migrations',
        directory: '../migrations',
        loadExtensions: ['.ts'],
    },
    seeds: { directory: '../seeds', recursive: true },
});
//# sourceMappingURL=knexfile.js.map