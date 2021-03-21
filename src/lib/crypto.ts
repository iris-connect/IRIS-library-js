import * as crypto from 'crypto';

export function encryptData(keyOfHealthDepartment: string, data): { dataToTransport: string; keyToTransport: string } {
  const publicKey = crypto.createPublicKey(keyOfHealthDepartment);
  const iv = crypto.randomBytes(16);
  const key = crypto.randomBytes(32);
  const cipher = crypto.createCipheriv('aes-256', key, iv);
  const encryptedData = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()]);
  const encryptedKey = crypto.publicEncrypt(
    { key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha3' },
    key,
  );
  return {
    dataToTransport: encryptedData.toString('base64'),
    keyToTransport: encryptedKey.toString('base64'),
  };
}
