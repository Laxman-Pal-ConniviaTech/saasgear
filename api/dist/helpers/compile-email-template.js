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
const handlebars_1 = __importDefault(require("handlebars"));
const mjml_1 = __importDefault(require("mjml"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function compileEmailTemplate({ fileName, data }) {
    return __awaiter(this, void 0, void 0, function* () {
        const mjMail = yield fs_1.default.promises.readFile(path_1.default.join('email-templates', fileName), 'utf8');
        const template = (0, mjml_1.default)(mjMail).html;
        return handlebars_1.default.compile(template)(data).toString();
    });
}
exports.default = compileEmailTemplate;
//# sourceMappingURL=compile-email-template.js.map