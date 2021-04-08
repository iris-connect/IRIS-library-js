"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const crypto_1 = require("./crypto");
const util_1 = require("./util");
const defaultOptions = {
    baseUrl: '',
};
class Iris {
    /**
     * Generate an instance of the IRIS connector library
     *
     * @param options General settings like baseUrl
     */
    constructor(options) {
        this.codeKeyMap = new Map();
        const opts = Object.assign(defaultOptions, options);
        this.axiosInstance = axios_1.default.create({
            baseURL: opts.baseUrl,
        });
    }
    /**
     * Retrieve the data request and relevant information of the requesting health office
     *
     * @param code The code tied to the data request
     * @returns Data Request
     */
    async getDataRequest(code) {
        const response = await this.axiosInstance.get(`/data-requests/${code}`);
        if (response.status !== 200) {
            console.error('IRIS Gateway responded the following data', response.data);
            throw new Error(`Request failed with status Code ${response.status}`);
        }
        const dataRequest = response.data;
        this.codeKeyMap.set(code, {
            key: dataRequest.key,
            keyReferenz: dataRequest.keyReferenz,
        });
        return {
            healthDepartment: dataRequest.healthDepartment,
            start: dataRequest.start,
            end: dataRequest.end,
            requestDetails: dataRequest.requestDetails,
        };
    }
    /**
     * Sends Contact and event information to IRIS
     *
     * @param code The code tied to the data request
     * @param data Data to be sent
     * @param user Information about the user sending the data
     */
    async sendContactsEvents(code, data, user) {
        if (!this.codeKeyMap.has(code)) {
            throw new Error("Code could not be found in key map. Did you perform 'getDataRequest' before?");
        }
        const keys = this.codeKeyMap.get(code);
        const { dataToTransport, keyToTransport, nonce } = await crypto_1.encryptData(keys.key, data);
        const response = await this.axiosInstance.post(`/data-submissions/${code}/contacts_events`, {
            checkCode: [util_1.getNameCheckHash(user.firstName, user.lastName), util_1.getBirthDateCheckHash(user.birthDate)].filter((c) => !!c),
            secret: keyToTransport,
            keyReferenz: keys.keyReferenz,
            encryptedData: dataToTransport,
            nonce,
        });
        if (response.status !== 201) {
            console.error('IRIS Gateway responded the following data', response.data);
            throw new Error(`Request failed with status Code ${response.status}`);
        }
        this.codeKeyMap.delete(code);
    }
}
exports.default = Iris;
//# sourceMappingURL=Iris.js.map