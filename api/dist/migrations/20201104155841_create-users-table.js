"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
function up(knex) {
    return knex.schema.createTable('users', (t) => {
        t.increments('id');
        t.string('name').notNullable();
        t.string('email').notNullable();
        t.string('password');
        t.boolean('is_active').defaultTo(false);
        t.string('position');
        t.string('company');
        t.string('avatar_url');
        t.string('provider');
        t.string('provider_id', 30);
        t.dateTime('created_at')
            .notNullable()
            .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        t.dateTime('updated_at')
            .notNullable()
            .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        t.dateTime('deleted_at');
        t.unique(['email']);
    });
}
exports.up = up;
function down(knex) {
    return knex.schema.dropTable('users');
}
exports.down = down;
//# sourceMappingURL=20201104155841_create-users-table.js.map