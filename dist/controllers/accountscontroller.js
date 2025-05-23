"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccount = void 0;
const helpers_1 = require("../utils/helpers");
const helpers_2 = require("../utils/helpers");
const encryption_1 = require("../utils/encryption");
const passwordService_1 = require("../utils/passwordService");
// In a real application, you would interact with a database here
const accounts = [];
const createAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, surname, email, phoneNumber, dateOfBirth, password } = req.body;
    if (!firstName || !surname || !email || !phoneNumber || !dateOfBirth || !req.body.password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    try {
        const accountNumber = yield (0, helpers_1.generateUniqueAccountNumber)();
        const cardNumber = yield (0, helpers_2.generateCardNumber)();
        const cvv = (0, helpers_2.generateCvv)();
        const expiryDate = (0, helpers_2.generateExpiryDate)();
        const hashedPassword = yield (0, passwordService_1.hashPassword)(password);
        const encryptedCardNumber = (0, encryption_1.encrypt)(cardNumber);
        const encryptedCvv = (0, encryption_1.encrypt)(cvv);
        const encryptedExpiryDate = (0, encryption_1.encrypt)(expiryDate);
        const encryptedPhoneNumber = (0, encryption_1.encrypt)(phoneNumber);
        const encryptedDateOfBirth = (0, encryption_1.encrypt)(dateOfBirth);
        const newAccount = {
            accountNumber,
            firstName,
            surname,
            email,
            passwordHash: hashedPassword,
            phoneNumber: JSON.stringify(encryptedPhoneNumber), // Store as stringified JSON
            dateOfBirth: JSON.stringify(encryptedDateOfBirth),
            cardNumber: JSON.stringify(encryptedCardNumber),
            cvv: JSON.stringify(encryptedCvv),
            expiryDate: JSON.stringify(encryptedExpiryDate),
            createdAt: new Date(),
        };
        const decryptedPhoneNumber = (0, encryption_1.decrypt)(JSON.parse(newAccount.phoneNumber));
        const decryptedDateOfBirth = (0, encryption_1.decrypt)(JSON.parse(newAccount.dateOfBirth));
        const decryptedCardNumber = (0, encryption_1.decrypt)(JSON.parse(newAccount.cardNumber));
        const decryptedCvv = (0, encryption_1.decrypt)(JSON.parse(newAccount.cvv));
        const decryptedExpiryDate = (0, encryption_1.decrypt)(JSON.parse(newAccount.expiryDate));
        accounts.push(newAccount); // In a real app, save to your database
        res.status(201).json({
            message: 'Account created successfully.',
            accountNumber,
            firstName,
            surname,
            email,
            phoneNumber: decryptedPhoneNumber,
            dateOfBirth: decryptedDateOfBirth,
            cardNumber: decryptedCardNumber,
            cvv: decryptedCvv,
            expiryDate: decryptedExpiryDate,
            encryptedDetails: {
                phoneNumber: encryptedPhoneNumber,
                dateOfBirth: encryptedDateOfBirth,
                cardNumber: encryptedCardNumber,
                cvv: encryptedCvv,
                expiryDate: encryptedExpiryDate,
            }
        });
    }
    catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ error: 'Failed to create account.' });
    }
});
exports.createAccount = createAccount;
