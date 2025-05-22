// src/utils/helpers.ts
import crypto from 'crypto';
import AccountModel from '../models/accountModel'; // <-- NEW: Import AccountModel

// Generate a unique 10-digit account number (now checks DB for uniqueness)
export async function generateUniqueAccountNumber(): Promise<string> {
  let accountNumber: string;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random 10-digit number
    accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    // Check if an account with this number already exists in the database
    // AccountModel.exists() returns null if not found, or an object if found.
    const existingAccount = await AccountModel.exists({ accountNumber: accountNumber });

    if (!existingAccount) {
      isUnique = true; // Found a unique number
    }
    // If not unique, the loop will continue to generate another number
  }
  return accountNumber!; // Asserting non-null as loop guarantees a value
}


// Generate a 16-digit card number (no DB check needed for this)
export function generateCardNumber(): string {
  let cardNumber = '';
  for (let i = 0; i < 16; i++) {
    cardNumber += Math.floor(Math.random() * 10);
  }
  return cardNumber;
}

// Generate a 3-digit CVV
export function generateCvv(): string {
  return Math.floor(100 + Math.random() * 900).toString();
}

// Generate an expiry date 5 years from now
export function generateExpiryDate(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 5);
  // Format as MM/YY
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${month}/${year}`;
}