// src/models/accountModel.ts
import mongoose, { Schema, Document } from 'mongoose';
import { Account, EncryptedData } from './account'; // Import EncryptedData interface from your account.ts

// Extend your Account interface to include Mongoose's Document properties
// This is necessary because Mongoose adds properties like _id, __v, etc.
export interface IAccount extends Account, Document {
  accountNumber: string;
  firstName: string;
  surname: string;
  email: string;
  passwordHash: string;
  phoneNumber: EncryptedData; // Store as EncryptedData object
  dateOfBirth: EncryptedData; // Store as EncryptedData object
  cardNumber: EncryptedData;   // Store as EncryptedData object
  cvv: EncryptedData;          // Store as EncryptedData object
  expiryDate: EncryptedData;   // Store as EncryptedData object
  createdAt: Date;
}

// Define the Mongoose Schema for EncryptedData
const EncryptedDataSchema = new Schema<EncryptedData>({
  iv: { type: String, required: true },
  encryptedData: { type: String, required: true },
  authTag: { type: String, required: true },
}, { _id: false }); // _id: false means Mongoose won't add a default _id to this sub-document

// Define the Mongoose Schema for Account
const AccountSchema = new Schema<IAccount>({
  accountNumber: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phoneNumber: { type: EncryptedDataSchema, required: true }, // Use the sub-schema
  dateOfBirth: { type: EncryptedDataSchema, required: true }, // Use the sub-schema
  cardNumber: { type: EncryptedDataSchema, required: true },   // Use the sub-schema
  cvv: { type: EncryptedDataSchema, required: true },          // Use the sub-schema
  expiryDate: { type: EncryptedDataSchema, required: true },   // Use the sub-schema
  createdAt: { type: Date, default: Date.now },
});

// Create the Mongoose Model
// 'Account' is the singular name for the collection. Mongoose will create 'accounts' collection in MongoDB.
const AccountModel = mongoose.model<IAccount>('Account', AccountSchema);

export default AccountModel;