"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const webcrypto_1 = require("@peculiar/webcrypto");
const util_1 = require("./lib/util");
const md5 = require("md5");
const crypto = new webcrypto_1.Crypto();
const _1 = require(".");
if (typeof TextEncoder === 'undefined') {
    global.TextEncoder = require('util').TextEncoder;
    global.TextDecoder = require('util').TextDecoder;
}
jest.mock('axios');
const mockedAxios = axios_1.default;
describe('index', () => {
    let privateKey;
    let publicKey;
    let dataRequest;
    const submission = {
        contacts: {
            contactPersons: [],
            dataProvider: {
                firstName: 'Hans',
                lastName: 'Müller',
            },
        },
        events: {
            events: [],
            dataProvider: {
                firstName: 'Hans',
                lastName: 'Müller',
            },
        },
    };
    beforeAll(async (done) => {
        mockedAxios.create.mockImplementation(() => {
            return mockedAxios;
        });
        const keys = await crypto.subtle.generateKey({
            name: 'RSA-OAEP',
            hash: 'SHA-256',
            publicExponent: new Uint8Array([1, 0, 1]),
            modulusLength: 2048,
        }, true, ['encrypt', 'decrypt']);
        const exported = await crypto.subtle.exportKey('spki', keys.publicKey);
        const exportedAsString = util_1.ab2str(exported);
        const exportedAsBase64 = window.btoa(exportedAsString);
        publicKey = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
        privateKey = keys.privateKey;
        dataRequest = {
            healthDepartment: 'Test Health Department',
            key: window.btoa(publicKey),
            keyReferenz: 'random-string-keyref',
            start: '2011-10-05T14:48:00.000Z',
            end: '2021-10-05T14:48:00.000Z',
        };
        done();
    });
    it('provides the Iris class', () => {
        expect(new _1.default({})).toBeDefined();
    });
    it('can retrieve a data request and send a corresponding data submission', async () => {
        mockedAxios.get.mockResolvedValue({ status: 200, data: dataRequest });
        const iris = new _1.default({});
        const dataRequestResult = await iris.getDataRequest('12345-abcde');
        expect(dataRequestResult).toEqual({
            healthDepartment: 'Test Health Department',
            start: '2011-10-05T14:48:00.000Z',
            end: '2021-10-05T14:48:00.000Z',
        });
        expect(mockedAxios.get).toHaveBeenCalledWith('/data-requests/12345-abcde');
        mockedAxios.post.mockResolvedValue({ status: 201, data: { success: true } });
        await iris.sendContactsEvents('12345-abcde', submission, {
            firstName: 'Hans',
            lastName: 'Müller',
            birthDate: '1963-01-05T14:48:00.000Z',
        });
        expect(mockedAxios.post).toHaveBeenCalledWith('/data-submissions/12345-abcde/contacts_events', {
            checkCode: [expect.any(String), expect.any(String)],
            secret: expect.any(String),
            keyReferenz: 'random-string-keyref',
            encryptedData: expect.any(String),
            nonce: expect.any(String),
        });
        const submittedData = mockedAxios.post.mock.calls[0][1];
        expect(submittedData.checkCode[0]).toEqual(md5('hansmller'));
        expect(submittedData.checkCode[1]).toEqual(md5('19630105'));
        const symmetricKeyData = await crypto.subtle.decrypt({
            name: 'RSA-OAEP',
        }, privateKey, // RSA private key
        Buffer.from(submittedData.secret, 'base64'));
        const symmetricKey = await crypto.subtle.importKey('raw', symmetricKeyData, 'AES-GCM', true, ['decrypt']);
        const decryptedData = util_1.pack(await crypto.subtle.decrypt({
            name: 'AES-GCM',
            iv: Buffer.from(submittedData.nonce, 'base64'),
        }, symmetricKey, // AES key
        Buffer.from(submittedData.encryptedData, 'base64')));
        const result = util_1.decode(new Uint8Array(util_1.unpack(decryptedData)));
        expect(JSON.parse(result)).toEqual(submission);
    });
});
//# sourceMappingURL=index.test.js.map