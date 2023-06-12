"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertPrice = exports.priceColumns = void 0;
const database_config_1 = __importDefault(require("~/config/database.config"));
const database_constant_1 = require("~/constants/database.constant");
const TABLE = database_constant_1.TABLES.prices;
exports.priceColumns = {
    id: 'prices.id',
    amount: 'prices.amount',
    type: 'prices.type',
    stripeId: 'prices.stripe_id',
    productId: 'prices.product_id',
    createAt: 'prices.created_at',
    updatedAt: 'prices.updated_at',
};
function insertPrice(priceData = [], transaction) {
    return (0, database_config_1.default)(TABLE).insert(priceData).transacting(transaction);
}
exports.insertPrice = insertPrice;
//# sourceMappingURL=prices.repository.js.map