"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
function up(knex) {
    return knex.schema.createTable('user_tokens', (t) => {
        t.increments('id');
        t.integer('user_id').unsigned().notNullable();
        t.string('token');
        t.string('type');
        t.boolean('is_active').defaultTo(true);
        t.dateTime('created_at')
            .notNullable()
            .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        t.dateTime('updated_at')
            .notNullable()
            .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        t.foreign('user_id').references('id').inTable('users');
    });
}
exports.up = up;
function down(knex) {
    return knex.schema.dropTable('user_tokens');
}
exports.down = down;
//# sourceMappingURL=20201106181901_create-user-tokens.js.map