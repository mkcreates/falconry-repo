const CryptoJS = require('crypto-js');

// Encryption
export function encrypt(text, secretKey) {
    const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString()
    return ciphertext
}

// Decryption
export function decrypt(ciphertext, secretKey) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey)
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8)
    return decryptedText
}