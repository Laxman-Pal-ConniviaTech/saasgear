"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
const seed = (knex) => knex('users')
    .del()
    .then(() => knex('users').insert([
    { email: 'abc@gmail.com', password: 1, name: '1' },
    { email: 'abc1@gmail.com', password: 1, name: '2' },
    { email: 'abc2@gmail.com', password: 1, name: '3' },
]));
exports.seed = seed;
//# sourceMappingURL=test.js.map