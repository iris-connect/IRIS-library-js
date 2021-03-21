"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBirthDateCheckHash = exports.getNameCheckHash = void 0;
const crypto = require("crypto");
function getNameCheckHash(firstName, lastName) {
    const str = `${firstName.trim()}${lastName.trim()}`.toLowerCase().replace(/\W/g, '');
    return crypto.createHash('md5').update(str).digest('base64');
}
exports.getNameCheckHash = getNameCheckHash;
function getBirthDateCheckHash(birthDate) {
    if (!birthDate) {
        return undefined;
    }
    const date = new Date(birthDate);
    const str = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
    return crypto.createHash('md5').update(str).digest('base64');
}
exports.getBirthDateCheckHash = getBirthDateCheckHash;
//# sourceMappingURL=util.js.map