"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToSlug = exports.normalizeEmail = void 0;
function normalizeEmail(text) {
    return text.toLowerCase().trim();
}
exports.normalizeEmail = normalizeEmail;
/**
 * Function to convert vietnamese string to slug
 *
 * Link https://gist.github.com/codeguy/6684588
 *
 */
function stringToSlug(str) {
    const from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ';
    const to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy';
    for (let i = 0, l = from.length; i < l; i += 1) {
        str = str.replace(RegExp(from[i], 'gi'), to[i]);
    }
    str = str.toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-');
    return str;
}
exports.stringToSlug = stringToSlug;
//# sourceMappingURL=string.helper.js.map