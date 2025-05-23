import { Request, Response } from 'express';
import { Account } from '../models/account';
import  IAccountDocument  from '../models/accountModel'; 
import { generateUniqueAccountNumber } from '../utils/helpers';
import { generateCardNumber, generateCvv, generateExpiryDate } from '../utils/helpers';
import { encrypt, decrypt } from '../utils/encryption';
import { hashPassword } from '../utils/passwordService';


// In a real application, you would interact with a database here
// const accounts: Account[] = [];

export const getAllAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await IAccountDocument.find({});

    const responseAccounts = await Promise.all(accounts.map(async account => {
      // Derive fullName
      const fullName = `${account.firstName} ${account.surname}`;

      // Initialize decrypted variables, handle potential missing fields gracefully
      let decryptedPhoneNumber: string | null = null;
      let decryptedDateOfBirth: string | null = null;
      let decryptedCardNumber: string | null = null;
      let decryptedCvv: string | null = null;
      let decryptedExpiryDate: string | null = null;

      // Decrypt sensitive fields ONLY if they exist on the account object and are valid EncryptedData structure
      if (account.phoneNumber && account.phoneNumber.iv && account.phoneNumber.encryptedData && account.phoneNumber.authTag) {
        decryptedPhoneNumber = await decrypt(account.phoneNumber);
      }
      if (account.dateOfBirth && account.dateOfBirth.iv && account.dateOfBirth.encryptedData && account.dateOfBirth.authTag) {
        decryptedDateOfBirth = await decrypt(account.dateOfBirth);
      }
      // Add checks for card number, cvv, expiry date
      if (account.cardNumber && account.cardNumber.iv && account.cardNumber.encryptedData && account.cardNumber.authTag) {
        decryptedCardNumber = await decrypt(account.cardNumber);
      }
      if (account.cvv && account.cvv.iv && account.cvv.encryptedData && account.cvv.authTag) {
        decryptedCvv = await decrypt(account.cvv);
      }
      if (account.expiryDate && account.expiryDate.iv && account.expiryDate.encryptedData && account.expiryDate.authTag) {
        decryptedExpiryDate = await decrypt(account.expiryDate);
      }

      return {
        _id: account._id,
        accountNumber: account.accountNumber,
        fullName: fullName, // Added full name
        email: account.email,
        createdAt: account.createdAt,
        // Sensitive fields: showing both encrypted and decrypted versions
        // Include the fields only if they exist on the account object
        phoneNumber: account.phoneNumber ? {
          encrypted: account.phoneNumber,
          decrypted: decryptedPhoneNumber,
        } : null,
        dateOfBirth: account.dateOfBirth ? {
          encrypted: account.dateOfBirth,
          decrypted: decryptedDateOfBirth,
        } : null,
        cardNumber: account.cardNumber ? { // <-- Ensure this is included
          encrypted: account.cardNumber,
          decrypted: decryptedCardNumber,
        } : null,
        cvv: account.cvv ? { // <-- Ensure this is included
          encrypted: account.cvv,
          decrypted: decryptedCvv,
        } : null,
        expiryDate: account.expiryDate ? { // <-- Ensure this is included
          encrypted: account.expiryDate,
          decrypted: decryptedExpiryDate,
        } : null,
      };
    }));
    res.status(200).json(responseAccounts);
  } catch (error: unknown) {
    console.error('Error fetching all accounts (Trial of the Ledger):', error);
    if (error instanceof Error) {
      return res.status(500).json({ error: `Failed to fetch accounts: ${error.message}` });
    }
    res.status(500).json({ error: 'An unknown error occurred while fetching accounts.' });
  }
};export const createAccount = async (req: Request, res: Response) => {
  const { firstName, surname, email, phoneNumber, dateOfBirth, password } = req.body;

  if (!firstName || !surname || !email || !phoneNumber || !dateOfBirth || !req.body.password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const accountNumber = await generateUniqueAccountNumber();
    const cardNumber = await generateCardNumber(); 
    const cvv = generateCvv();                   
    const expiryDate = generateExpiryDate();
    const hashedPassword = await hashPassword(password);
    const encryptedCardNumber = encrypt(cardNumber);
    const encryptedCvv = encrypt(cvv);
    const encryptedExpiryDate = encrypt(expiryDate);
    const encryptedPhoneNumber = encrypt(phoneNumber);
    const encryptedDateOfBirth = encrypt(dateOfBirth);
    

    const newAccount: Account = {
      accountNumber,
      firstName,
      surname,
      email,
      passwordHash: hashedPassword,
      phoneNumber: encryptedPhoneNumber,
      dateOfBirth: encryptedDateOfBirth,
      cardNumber: encryptedCardNumber,
      cvv: encryptedCvv,
      expiryDate: encryptedExpiryDate,
      createdAt: new Date(),
    };

    const createdAccount = await IAccountDocument.create(newAccount);
    const decryptedPhoneNumber = decrypt(createdAccount.phoneNumber);
    const decryptedDateOfBirth = decrypt(createdAccount.dateOfBirth);
    const decryptedCardNumber = decrypt(createdAccount.cardNumber);
    const decryptedCvv = decrypt(createdAccount.cvv);
    const decryptedExpiryDate = decrypt(createdAccount.expiryDate);

    res.status(201).json({
      accountNumber: createdAccount.accountNumber,
      firstName: createdAccount.firstName,
      surname: createdAccount.surname,
      email: createdAccount.email,
      phoneNumber: decryptedPhoneNumber,
      dateOfBirth: decryptedDateOfBirth,
      cardNumber: decryptedCardNumber,
      cvv: decryptedCvv,
      expiryDate: decryptedExpiryDate,
      encryptedDetails: {
        phoneNumber: createdAccount.phoneNumber,
        dateOfBirth: createdAccount.dateOfBirth,
        cardNumber: createdAccount.cardNumber,
        cvv: createdAccount.cvv,
        expiryDate: createdAccount.expiryDate,
      },
      message: 'Account created successfully and saved to MongoDB!'
    });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Failed to create account.' });
  }
  
};
