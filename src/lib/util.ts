import * as crypto from 'crypto';

export function getNameCheckHash(firstName: string, lastName: string): string {
  const str = `${firstName.trim()}${lastName.trim()}`.toLowerCase().replace(/\W/g, '');
  return crypto.createHash('md5').update(str).digest('base64');
}
export function getBirthDateCheckHash(birthDate?: string): string | undefined {
  if (!birthDate) {
    return undefined;
  }
  const date = new Date(birthDate);
  const str = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`
  return crypto.createHash('md5').update(str).digest('base64');
}
