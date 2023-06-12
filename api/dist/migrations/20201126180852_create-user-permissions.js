"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
function up(knex) {
    return knex.schema.createTable('user_permissions', (t) => {
        t.increments('id');
        t.integer('user_id').unsigned().notNullable();
        t.string('permission');
        t.integer('user_plan_id').unsigned();
        t.dateTime('created_at')
            .notNullable()
            .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        t.dateTime('updated_at')
            .notNullable()
            .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        t.dateTime('deleted_at');
        t.foreign('user_id').references('id').inTable('users');
        t.foreign('user_plan_id').references('id').inTable('user_plans');
    });
}
exports.up = up;
function down(knex) {
    return knex.schema.dropTable('user_permissions');
}
exports.down = down;
//# sourceMappingURL=20201126180852_create-user-permissions.js.map