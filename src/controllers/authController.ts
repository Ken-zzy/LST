// src/controllers/authController.ts
import { Request, Response } from 'express';
import { comparePassword } from '../utils/passwordService'; // Import comparePassword
import AccountModel from '../models/accountModel'; // Import Account interface
// import AccountModel from '../models/AccountModel';
// import { comparePassword } from '../utils/passwordService';

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // 1. Find the account by email in MongoDB
    const account = await AccountModel.findOne({ email });

    if (!account) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // 2. Compare the provided password with the hashed password from the database
    const isPasswordValid = await comparePassword(password, account.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // --- Authentication successful ---
    // At this point, the user is authenticated.
    // We can respond with a success message and perhaps some non-sensitive user info.
    res.status(200).json({ message: 'Login successful!', user: { email: account.email, firstName: account.firstName } });

  } catch (error: unknown) { // Use 'unknown' for type safety
    console.error('Login error:', error);
    // You can add more specific error handling here if needed, similar to createAccount
    if (error instanceof Error) {
        return res.status(500).json({ error: `An error occurred during login: ${error.message}` });
    }
    res.status(500).json({ error: 'An unknown error occurred during login.' });
  }
};