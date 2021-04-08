import * as md5 from 'md5';

export function getNameCheckHash(firstName: string, lastName: string): string {
  const str = `${firstName.trim()}${lastName.trim()}`.toLowerCase().replace(/\W/g, '');
  return md5(str);
}
export function getBirthDateCheckHash(birthDate?: string): string | undefined {
  if (!birthDate) {
    return undefined;
  }
  const date = new Date(birthDate);
  const str = `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
  return md5(str);
}

export function encode(data: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(data);
}

export function decode(data: Uint8Array): string {
  const decoder = new TextDecoder('utf8');
  return decoder.decode(data);
}

export function str2ab(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export function ab2str(buf: ArrayBuffer): string {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

export function pack(buffer: ArrayBuffer): string {
  return window.btoa(ab2str(buffer));
}

export function unpack(packed: string): ArrayBuffer {
  return str2ab(window.atob(packed));
}
