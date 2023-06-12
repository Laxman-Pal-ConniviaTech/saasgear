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
const stripe_1 = __importDefault(require("stripe"));
const node_1 = __importDefault(require("@sentry/node"));
const products_repository_1 = require("~/repository/products.repository");
const stripe = new stripe_1.default(process.env.STRIPE_PRIVATE_KEY, {
    apiVersion: '2020-08-27',
});
const products = [
    { name: 'Starter', amount: 75 },
    { name: 'Professional', amount: 295 },
];
function createProductItem(item, dataStripe) {
    return __awaiter(this, void 0, void 0, function* () {
        const productStripe = dataStripe.find((pro) => pro.name === item.name);
        let productData = null;
        let priceData = [];
        if (productStripe) {
            productData = {
                name: item.name,
                type: item.name.toLowerCase(),
                stripe_id: productStripe.id,
            };
            priceData = [
                {
                    amount: item.amount,
                    type: 'monthly',
                    stripe_id: productStripe.prices.find((pri) => pri.type === 'month').id,
                },
                {
                    amount: item.amount * 9,
                    type: 'yearly',
                    stripe_id: productStripe.prices.find((pri) => pri.type === 'year').id,
                },
            ];
        }
        else {
            const product = yield stripe.products.create({ name: item.name });
            if (!product) {
                return false;
            }
            const [priceMonth, priceYear] = yield Promise.all([
                stripe.prices.create({
                    unit_amount: item.amount * 100,
                    currency: 'usd',
                    recurring: { interval: 'month' },
                    product: product.id,
                }),
                stripe.prices.create({
                    unit_amount: item.amount * 9 * 100,
                    currency: 'usd',
                    recurring: { interval: 'year' },
                    product: product.id,
                }),
            ]);
            if (!priceMonth || !priceYear) {
                return false;
            }
            productData = {
                name: item.name,
                type: item.name.toLowerCase(),
                stripe_id: product.id,
            };
            priceData = [
                {
                    amount: item.amount,
                    type: 'monthly',
                    stripe_id: priceMonth.id,
                },
                {
                    amount: item.amount * 9,
                    type: 'yearly',
                    stripe_id: priceYear.id,
                },
            ];
        }
        if (productData && priceData.length) {
            return (0, products_repository_1.insertProduct)(productData, priceData);
        }
        return true;
    });
}
function getProductAndPriceStripe(pro) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: dataPrices } = yield stripe.prices.list({ product: pro.id });
        const prices = dataPrices === null || dataPrices === void 0 ? void 0 : dataPrices.map((pri) => ({ id: pri.id, type: pri.recurring.interval }));
        return {
            id: pro.id,
            name: pro.name,
            prices,
        };
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: stripeProducts } = yield stripe.products.list();
        let data = [];
        if (stripeProducts.length) {
            data = yield Promise.all(stripeProducts.map((pro) => getProductAndPriceStripe(pro)));
        }
        const productTypes = products.map((product) => product.name.toLowerCase());
        const listProducts = yield (0, products_repository_1.findProductInType)(productTypes);
        let newProducts = products;
        if (listProducts.length > 0) {
            const typesExist = listProducts.map((p) => p.type);
            newProducts = products.filter((product) => !typesExist.includes(product.name.toLowerCase()));
        }
        if (newProducts.length > 0) {
            return Promise.all(newProducts.map((productItem) => createProductItem(productItem, data)));
        }
        return true;
    });
}
run().then(() => console.log('insert successfully')).then(() => process.exit()).catch((err) => node_1.default.captureException(err));
//# sourceMappingURL=create-products.js.map