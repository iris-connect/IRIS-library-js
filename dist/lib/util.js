"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpack = exports.pack = exports.ab2str = exports.str2ab = exports.decode = exports.encode = exports.getBirthDateCheckHash = exports.getNameCheckHash = void 0;
const md5 = require("md5");
function getNameCheckHash(firstName, lastName) {
    const str = `${firstName.trim()}${lastName.trim()}`.toLowerCase().replace(/\W/g, '');
    return md5(str);
}
exports.getNameCheckHash = getNameCheckHash;
function getBirthDateCheckHash(birthDate) {
    if (!birthDate) {
        return undefined;
    }
    const date = new Date(birthDate);
    const str = `${date.getFullYear()}${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
    return md5(str);
}
exports.getBirthDateCheckHash = getBirthDateCheckHash;
function encode(data) {
    const encoder = new TextEncoder();
    return encoder.encode(data);
}
exports.encode = encode;
function decode(data) {
    const decoder = new TextDecoder('utf8');
    return decoder.decode(data);
}
exports.decode = decode;
function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
exports.str2ab = str2ab;
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}
exports.ab2str = ab2str;
function pack(buffer) {
    return window.btoa(ab2str(buffer));
}
exports.pack = pack;
function unpack(packed) {
    return str2ab(window.atob(packed));
}
exports.unpack = unpack;
//# sourceMappingURL=util.js.map