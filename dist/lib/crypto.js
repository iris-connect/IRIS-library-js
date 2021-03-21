"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptData = void 0;
const crypto = require("crypto");
function encryptData(keyOfHealthDepartment, data) {
    const nonce = crypto.randomBytes(16);
    const key = crypto.randomBytes(32);
    const cipher = crypto.createCipheriv('AES-256-CBC', key, nonce);
    const dataString = JSON.stringify(data);
    const encryptedData = Buffer.concat([cipher.update(dataString, 'utf8'), cipher.final()]);
    const encryptedKey = crypto.publicEncrypt({ key: keyOfHealthDepartment }, key);
    return {
        dataToTransport: encryptedData.toString('base64'),
        keyToTransport: encryptedKey.toString('base64'),
        nonce: nonce.toString('base64'),
    };
}
exports.encryptData = encryptData;
//# sourceMappingURL=crypto.js.map