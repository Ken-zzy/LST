// src/utils/encryption.ts
import crypto from 'crypto'; // This is Node.js's built-in cryptography module
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.ENCRYPTION_KEY;
// --- 1. The Key (from environment variables) ---
// This key must be a 32-character hexadecimal string (e.g., "abcdef0123456789abcdef0123456789...")
// You would set this as an environment variable, like:
// ENCRYPTION_KEY="YOUR_SUPER_SECRET_32_BYTE_HEX_KEY" node dist/server.js
// const ENCRYPTION_KEY_HEX = process.env.ENCRYPTION_KEY;

if (!key || key.length !== 64) { // 32 bytes = 64 hex characters
  console.error('CRITICAL ERROR: ENCRYPTION_KEY environment variable is missing or invalid.');
  console.error('Please generate a 32-byte (64 hex characters) key and set it.');
  process.exit(1); // Stop the application if the key isn't set securely
}

const ENCRYPTION_KEY = Buffer.from(key, 'hex'); // Convert hex string to a Buffer (raw bytes)

// --- 2. The Lockbox (Algorithm details) ---
const ALGORITHM = 'aes-256-gcm'; // AES with a 256-bit key in GCM mode
const IV_LENGTH = 16; // Size of the Initialization Vector (IV) in bytes

// Function to encrypt (put data in the lockbox)
export function encrypt(text: string): { iv: string; encryptedData: string; authTag: string } {
  // Get a fresh "sparkle" (IV) every time
  const iv = crypto.randomBytes(IV_LENGTH);

  // Create the cipher (our lockbox, ready to lock)
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  // Lock the data
  let encrypted = cipher.update(text, 'utf8', 'hex'); // Take text, convert to hex
  encrypted += cipher.final('hex'); // Finish locking

  // Get the "tamper-proof seal" (authentication tag)
  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString('hex'), // Store the sparkle as hex string
    encryptedData: encrypted, // Store the locked data as hex string
    authTag: authTag.toString('hex') // Store the seal as hex string
  };
}

// Function to decrypt (open the lockbox)
export function decrypt(encryptedObj: { iv: string; encryptedData: string; authTag: string }): string {
  // Convert our stored sparkle and seal back to raw bytes (Buffers)
  const iv = Buffer.from(encryptedObj.iv, 'hex');
  const authTag = Buffer.from(encryptedObj.authTag, 'hex');

  // Create the decipher (our lockbox, ready to unlock)
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  // Put the "tamper-proof seal" back on (VERY IMPORTANT!)
  decipher.setAuthTag(authTag);

  // Try to unlock the data
  let decrypted = decipher.update(encryptedObj.encryptedData, 'hex', 'utf8'); // Take hex, convert back to text
  decrypted += decipher.final('utf8'); // Finish unlocking (this will throw an error if tampering detected!)

  return decrypted;
}