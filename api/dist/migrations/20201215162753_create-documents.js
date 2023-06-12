"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
function up(knex) {
    return knex.schema.createTable('documents', (t) => {
        t.increments('id');
        t.string('name').notNullable();
        t.text('body').notNullable(); // collate('utf8mb4_unicode_ci')
        t.integer('user_id').unsigned().notNullable();
        t.dateTime('created_at')
            .notNullable()
            .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        t.dateTime('updated_at')
            .notNullable()
            .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        t.dateTime('deleted_at');
        t.foreign('user_id').references('id').inTable('users');
        t.collate('utf8mb4_unicode_ci');
    });
}
exports.up = up;
function down(knex) {
    return knex.schema.dropTable('documents');
}
exports.down = down;
//# sourceMappingURL=20201215162753_create-documents.js.map