"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptData = void 0;
const webcrypto_1 = require("@peculiar/webcrypto");
const util_1 = require("./util");
const crypto = new webcrypto_1.Crypto();
async function importRsaKey(pemBase64Encoded) {
    const pem = window.atob(pemBase64Encoded);
    // fetch the part of the PEM string between header and footer
    const pemHeader = '-----BEGIN PUBLIC KEY-----';
    const pemFooter = '-----END PUBLIC KEY-----';
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = util_1.str2ab(binaryDerString);
    return crypto.subtle.importKey('spki', binaryDer, {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
    }, true, ['encrypt']);
}
async function encryptData(keyOfHealthDepartment, data) {
    const nonce = crypto.getRandomValues(new Uint8Array(16));
    const key = await crypto.subtle.generateKey({
        name: 'AES-GCM',
        length: 256,
    }, true, ['encrypt']);
    const publicKey = await importRsaKey(keyOfHealthDepartment);
    const dataString = JSON.stringify(data);
    const encryptedData = await crypto.subtle.encrypt({
        name: 'AES-GCM',
        iv: nonce,
    }, key, util_1.encode(dataString));
    const encryptedKey = await crypto.subtle.encrypt({
        name: 'RSA-OAEP',
    }, publicKey, await crypto.subtle.exportKey('raw', key));
    return {
        dataToTransport: util_1.pack(encryptedData),
        keyToTransport: util_1.pack(encryptedKey),
        nonce: util_1.pack(nonce),
    };
}
exports.encryptData = encryptData;
//# sourceMappingURL=crypto.js.map