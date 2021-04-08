export declare function encryptData(keyOfHealthDepartment: string, data: any): Promise<{
    dataToTransport: string;
    keyToTransport: string;
    nonce: string;
}>;
