"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
function up(knex) {
    return knex.schema.createTable('prices', (t) => {
        t.increments('id');
        t.float('amount').notNullable();
        t.string('type').notNullable();
        t.string('stripe_id').notNullable();
        t.integer('product_id').unsigned().notNullable();
        t.dateTime('created_at')
            .notNullable()
            .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        t.dateTime('updated_at')
            .notNullable()
            .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        t.foreign('product_id').references('id').inTable('products');
    });
}
exports.up = up;
function down(knex) {
    return knex.schema.dropTable('prices');
}
exports.down = down;
//# sourceMappingURL=20201126165854_create-prices.js.map