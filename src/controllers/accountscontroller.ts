import { Request, Response } from 'express';
import { Account } from '../models/account';
import  IAccountDocument  from '../models/accountModel'; 
import { generateUniqueAccountNumber } from '../utils/helpers';
import { generateCardNumber, generateCvv, generateExpiryDate } from '../utils/helpers';
import { encrypt, decrypt } from '../utils/encryption';
import { hashPassword } from '../utils/passwordService';


// In a real application, you would interact with a database here
// const accounts: Account[] = [];

export const createAccount = async (req: Request, res: Response) => {
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

export const getAllAccounts = async (req: Request, res: Response) => {
  try {
    // Find all documents in the 'accounts' collection
    const accounts = await IAccountDocument.find({});

    // Map the accounts to a cleaner format for the response.
    // We'll include basic info and the encrypted blobs.
    // We do NOT decrypt sensitive data here for a "get all" list.
    const responseAccounts = accounts.map(account => ({
      _id: account._id, // MongoDB's unique ID for the document
      accountNumber: account.accountNumber,
      firstName: account.firstName,
      surname: account.surname,
      email: account.email,
      // We explicitly DO NOT include passwordHash in the response
      phoneNumber: account.phoneNumber, // This will be the encrypted object
      dateOfBirth: account.dateOfBirth, // This will be the encrypted object
      createdAt: account.createdAt,
    }));

    res.status(200).json(responseAccounts);
  } catch (error: unknown) {
    console.error('Error fetching all accounts:', error);
    if (error instanceof Error) {
      return res.status(500).json({ error: `Failed to fetch accounts: ${error.message}` });
    }
    res.status(500).json({ error: 'An unknown error occurred while fetching accounts.' });
  }
};