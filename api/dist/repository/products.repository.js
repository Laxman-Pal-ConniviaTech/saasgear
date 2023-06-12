"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProductAndPriceByType = exports.findProductInType = exports.findProductByType = exports.insertProduct = exports.productColumns = void 0;
const database_config_1 = __importDefault(require("~/config/database.config"));
const database_constant_1 = require("~/constants/database.constant");
const prices_repository_1 = require("./prices.repository");
const TABLE = database_constant_1.TABLES.products;
exports.productColumns = {
    id: 'products.id',
    name: 'products.name',
    type: 'products.type',
    stripeId: 'products.stripe_id',
    createAt: 'products.created_at',
    updatedAt: 'products.updated_at',
};
function insertProduct(productData, priceDatas = []) {
    return __awaiter(this, void 0, void 0, function* () {
        let t;
        try {
            t = yield database_config_1.default.transaction();
            const [productId] = yield (0, database_config_1.default)(TABLE).transacting(t).insert(productData);
            yield (0, prices_repository_1.insertPrice)(priceDatas.map((priceItem) => (Object.assign(Object.assign({}, priceItem), { product_id: productId }))), t);
            yield t.commit();
            return true;
        }
        catch (error) {
            if (t)
                t.rollback();
            return false;
        }
    });
}
exports.insertProduct = insertProduct;
function findProductByType(type) {
    return (0, database_config_1.default)(TABLE).where({ type }).first();
}
exports.findProductByType = findProductByType;
function findProductInType(types) {
    return (0, database_config_1.default)(TABLE).whereIn('type', types);
}
exports.findProductInType = findProductInType;
function findProductAndPriceByType(productType, priceType) {
    return (0, database_config_1.default)(TABLE)
        .join(database_constant_1.TABLES.prices, exports.productColumns.id, prices_repository_1.priceColumns.productId)
        .select(exports.productColumns, `${prices_repository_1.priceColumns.id} as price_id`, prices_repository_1.priceColumns.amount, `${prices_repository_1.priceColumns.type} as price_type`, `${prices_repository_1.priceColumns.stripeId} as price_stripe_id`)
        .where({ [exports.productColumns.type]: productType, [prices_repository_1.priceColumns.type]: priceType })
        .first();
}
exports.findProductAndPriceByType = findProductAndPriceByType;
//# sourceMappingURL=products.repository.js.map