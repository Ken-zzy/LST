export interface Account {
  accountNumber: string;
  firstName: string;
  surname: string;
  email: string;
  passwordHash: string; // <-- NEW: To store the bcrypt hashed password
  phoneNumber: EncryptedData;
  dateOfBirth: EncryptedData;
  cardNumber: EncryptedData;
  cvv: EncryptedData;
  expiryDate: EncryptedData;
  createdAt: Date;
}
export interface EncryptedData {
  iv: string;
  encryptedData: string;
  authTag: string;
}
