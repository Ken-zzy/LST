// src/controllers/utilityController.ts
import { Request, Response } from 'express';
import { decrypt } from '../utils/encryption';
import { EncryptedData } from '../models/account';
// This interface defines the expected shape of the request body
// It expects an object where each key corresponds to a sensitive field
// and its value is the EncryptedData object.
interface DecryptBatchRequestBody {
  phoneNumber?: EncryptedData;
  dateOfBirth?: EncryptedData;
  cardNumber?: EncryptedData;
  cvv?: EncryptedData;
  expiryDate?: EncryptedData;
  // Add other sensitive fields here if they are stored encrypted
  [key: string]: EncryptedData | undefined; // Allow for other potential keys
}

export const decryptDataEndpoint = async (req: Request, res: Response) => {
  const encryptedFields: DecryptBatchRequestBody = req.body;
  const decryptedResult: { [key: string]: string | null } = {};

  if (Object.keys(encryptedFields).length === 0) {
    return res.status(400).json({ error: 'No encrypted data provided in the request body.' });
  }

  try {
    for (const key in encryptedFields) {
      if (encryptedFields.hasOwnProperty(key)) {
        const encryptedData = encryptedFields[key];

        // Basic check to ensure it's a valid EncryptedData object
        if (encryptedData && encryptedData.iv && encryptedData.encryptedData && encryptedData.authTag) {
          try {
            const decryptedValue = await decrypt(encryptedData);
            decryptedResult[key] = decryptedValue;
          } catch (decryptionError: unknown) {
            console.warn(`Warning: Failed to decrypt field "${key}":`, decryptionError);
            decryptedResult[key] = `Decryption Failed for ${key}`; // Indicate failure for specific field
          }
        } else {
          console.warn(`Warning: Invalid EncryptedData structure for field "${key}".`);
          decryptedResult[key] = `Invalid encrypted data format for ${key}`;
        }
      }
    }

    res.status(200).json({ decryptedData: decryptedResult });

  } catch (error: unknown) {
    console.error('Batch decryption endpoint error:', error);
    if (error instanceof Error) {
      return res.status(500).json({ error: `An error occurred during batch decryption: ${error.message}` });
    }
    res.status(500).json({ error: 'An unknown error occurred during batch decryption.' });
  }
};