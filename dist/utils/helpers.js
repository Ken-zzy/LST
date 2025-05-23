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
exports.generateUniqueAccountNumber = generateUniqueAccountNumber;
exports.generateCardNumber = generateCardNumber;
exports.generateCvv = generateCvv;
exports.generateExpiryDate = generateExpiryDate;
const uuid_1 = require("uuid");
// In a real application, you would interact with a database here
const existingAccountNumbers = new Set(); // Temporary in-memory storage
const existingCardNumbers = new Set();
function generateUniqueAccountNumber() {
    return __awaiter(this, void 0, void 0, function* () {
        let accountNumber;
        while (true) {
            const uuid = (0, uuid_1.v4)();
            const shortUUID = uuid.substring(0, 10);
            const decimalValue = parseInt(shortUUID, 16);
            accountNumber = String(decimalValue).slice(0, 10).padStart(10, '0');
            if (!existingAccountNumbers.has(accountNumber)) {
                existingAccountNumbers.add(accountNumber); // Simulate adding to database
                break;
            }
            // In a real scenario with a database, retries might be handled differently
            yield new Promise(resolve => setTimeout(resolve, 1)); // Avoid tight loop
        }
        return accountNumber;
    });
}
function generateCardNumber() {
    return __awaiter(this, void 0, void 0, function* () {
        let cardNumber;
        while (true) {
            const uuid = (0, uuid_1.v4)().replace(/-/g, ''); // Remove hyphens to get a longer string
            // Take a large portion of the UUID string (e.g., first 12-14 characters)
            // and combine with some random digits to ensure 16 digits
            let baseNumber = uuid.substring(0, 12); // Use a significant portion
            // Pad with random digits if needed to get to 16, and convert to number if desired
            // A simpler approach for uniqueness might be to convert the UUID part to a BigInt
            // For a strict 16-digit numeric, let's use a combination of UUID and random numbers.
            const randomDigits = Math.floor(Math.random() * 100000000) // Up to 8 random digits
                .toString()
                .padStart(8, '0');
            // Combine and slice to ensure 16 digits
            cardNumber = (baseNumber + randomDigits).substring(0, 16);
            // Simple check to ensure it's purely numeric for a card number
            if (!/^\d+$/.test(cardNumber)) {
                continue; // Regenerate if it's not purely numeric
            }
            // In a real scenario, you'd check against your database
            if (!existingCardNumbers.has(cardNumber)) {
                existingCardNumbers.add(cardNumber); // Simulate adding to database
                break;
            }
            yield new Promise(resolve => setTimeout(resolve, 1)); // Avoid tight loop
        }
        return cardNumber;
    });
}
function generateCvv() {
    // Generate a random number between 0 and 999
    const cvv = Math.floor(Math.random() * 1000);
    // Pad with leading zeros to ensure it's always 3 digits (e.g., 7 becomes "007")
    return String(cvv).padStart(3, '0');
}
function generateExpiryDate() {
    const today = new Date();
    const futureYear = today.getFullYear() + 3;
    const futureMonth = today.getMonth() + 1;
    const formattedMonth = String(futureMonth).padStart(2, '0');
    const formattedYear = String(futureYear).slice(-2);
    return `${formattedMonth}/${formattedYear}`;
}
