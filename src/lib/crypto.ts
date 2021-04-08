import { Crypto } from '@peculiar/webcrypto';
import { pack, encode, str2ab } from './util';

const crypto = new Crypto();

async function importRsaKey(pemBase64Encoded: string): Promise<CryptoKey> {
  const pem = window.atob(pemBase64Encoded);
  // fetch the part of the PEM string between header and footer
  const pemHeader = '-----BEGIN PUBLIC KEY-----';
  const pemFooter = '-----END PUBLIC KEY-----';
  const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
  // base64 decode the string to get the binary data
  const binaryDerString = window.atob(pemContents);
  // convert from a binary string to an ArrayBuffer
  const binaryDer = str2ab(binaryDerString);

  return crypto.subtle.importKey(
    'spki',
    binaryDer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['encrypt'],
  );
}

export async function encryptData(
  keyOfHealthDepartment: string,
  data,
): Promise<{ dataToTransport: string; keyToTransport: string; nonce: string }> {
  const nonce = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt'],
  );
  const publicKey = await importRsaKey(keyOfHealthDepartment);

  const dataString = JSON.stringify(data);
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: nonce,
    },
    key,
    encode(dataString),
  );

  const encryptedKey = await crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP',
    },
    publicKey,
    await crypto.subtle.exportKey('raw', key),
  );
  return {
    dataToTransport: pack(encryptedData),
    keyToTransport: pack(encryptedKey),
    nonce: pack(nonce),
  };
}
