import bcrypt from 'bcrypt';

// The 'salt rounds' determine how much work is needed to calculate the hash.
// Higher numbers are more secure but slower. 10-12 is a common recommendation.
const SALT_ROUNDS = 10;

/**
 * Hashes a plain-text password using bcrypt.
 * @param password The plain-text password to hash.
 * @returns A promise that resolves with the hashed password string.
 */
export async function hashPassword(password: string): Promise<string> {
  // bcrypt.hash() takes the password and the salt rounds.
  // It automatically generates a unique salt for each hash.
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plain-text password with a hashed password.
 * @param password The plain-text password provided by the user (e.g., during login).
 * @param hashedPassword The hashed password retrieved from the database.
 * @returns A promise that resolves to true if the passwords match, false otherwise.
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  // bcrypt.compare() takes the plain-text password and the hashed password.
  // It re-hashes the plain-text password with the salt extracted from the hashed password
  // and compares the result.
  return await bcrypt.compare(password, hashedPassword);
}