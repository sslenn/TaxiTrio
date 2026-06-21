const crypto = require('crypto');
const ALGORITHM = 'aes-256-gcm';

// 32-byte encryption key (64 hex characters) from environment or fallback
const hexKey = process.env.ENCRYPTION_KEY || 'e35c24e6a88b15d2a67bc4539ef2a29d5b4a682fd7cfc9b0e14d3f5a2b3c4d5e';
const KEY = Buffer.from(hexKey, 'hex');

function encrypt(text) {
  if (!text) return text;
  try {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${tag}:${encrypted}`;
  } catch (err) {
    console.error('Encryption failed:', err.message);
    return text;
  }
}

function decrypt(ciphertext) {
  if (!ciphertext) return ciphertext;
  
  // If the ciphertext is not in the format "iv:tag:encrypted", assume it is plain text (maintaining backward compatibility)
  const parts = ciphertext.split(':');
  if (parts.length !== 3) {
    return ciphertext;
  }

  try {
    const [ivHex, tagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.warn('Decryption failed, returning raw value:', err.message);
    return ciphertext;
  }
}

module.exports = { encrypt, decrypt };
