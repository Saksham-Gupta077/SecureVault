import CryptoJS from 'crypto-js';

export function encrypt(text: string, secretKey: string): string {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
}

export function decrypt(ciphertext: string, secretKey: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return '';
  }
}

export function hashKey(key: string): string {
  return CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex);
}
