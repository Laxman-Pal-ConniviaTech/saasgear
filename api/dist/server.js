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
/* eslint-disable wrap-iife */
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = require("path");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const apollo_server_express_1 = require("apollo-server-express");
const node_1 = require("@sentry/node");
const logger_middleware_1 = __importDefault(require("middlewares/logger.middleware"));
const root_schema_1 = __importDefault(require("./graphql/root.schema"));
const root_resolver_1 = __importDefault(require("./graphql/root.resolver"));
const get_user_logined_service_1 = __importDefault(require("./services/authentication/get-user-logined.service"));
const webhooks_servive_1 = __importDefault(require("./services/stripe/webhooks.servive"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const corsOptions = {
    optionsSuccessStatus: 200,
    credentials: true,
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};
(function startServer() {
    app.use((0, morgan_1.default)('combined', { stream: logger_middleware_1.default }));
    app.use((0, cors_1.default)(corsOptions));
    app.use(express_1.default.static((0, path_1.join)((0, path_1.resolve)(), 'public', 'uploads')));
    app.use((0, cookie_parser_1.default)());
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });
    app.post('/stripe-hooks', body_parser_1.default.raw({ type: 'application/json' }), webhooks_servive_1.default);
    const serverGraph = new apollo_server_express_1.ApolloServer({
        schema: (0, apollo_server_express_1.makeExecutableSchema)({
            typeDefs: root_schema_1.default,
            resolvers: root_resolver_1.default,
        }),
        plugins: [
            {
                requestDidStart() {
                    return {
                        didEncounterErrors(ctx) {
                            if (!ctx.operation)
                                return;
                            for (const err of ctx.errors) {
                                if (err instanceof apollo_server_express_1.ApolloError) {
                                    continue;
                                }
                                (0, node_1.withScope)((scope) => {
                                    scope.setTag('kind', ctx.operation.operation);
                                    scope.setExtra('query', ctx.request.query);
                                    scope.setExtra('variables', ctx.request.variables);
                                    if (err.path) {
                                        scope.addBreadcrumb({
                                            category: 'query-path',
                                            message: err.path.join(' > '),
                                            level: node_1.Severity.Debug,
                                        });
                                    }
                                    const transactionId = ctx.request.http.headers.get('x-transaction-id');
                                    if (transactionId) {
                                        scope.setTransactionName(transactionId);
                                    }
                                    (0, node_1.captureException)(err);
                                });
                            }
                        },
                    };
                },
            },
        ],
        context: ({ req, res }) => __awaiter(this, void 0, void 0, function* () {
            const { cookies } = req;
            const bearerToken = cookies.token || null;
            const user = yield (0, get_user_logined_service_1.default)(bearerToken, res);
            return {
                user,
                res,
            };
        }),
    });
    serverGraph.applyMiddleware({ app, cors: corsOptions });
    (0, node_1.init)({ dsn: process.env.SENTRY_DSN });
    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
})();
//# sourceMappingURL=server.js.map