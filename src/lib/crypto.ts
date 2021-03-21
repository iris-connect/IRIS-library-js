import * as crypto from 'crypto';

export function encryptData(
  keyOfHealthDepartment: string,
  data,
): { dataToTransport: string; keyToTransport: string; nonce: string } {
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
