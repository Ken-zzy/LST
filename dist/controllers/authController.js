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
exports.loginUser = exports.setMockAccounts = void 0;
const passwordService_1 = require("../utils/passwordService"); // Import comparePassword
// IMPORTANT: In a real app, you would fetch the account from a database!
// For now, we'll use our in-memory 'accounts' array.
// For simplicity in this example, let's assume 'accounts' can be accessed
// (In a real app, you'd have a database service to query accounts).
// Let's define a placeholder for our in-memory accounts array for testing.
// In a proper architecture, this would query a database.
const accounts = []; // This should ideally come from a shared 'database' mock or service
// A placeholder for the accounts array to simulate database access.
// In a full application, this would be replaced with actual database calls.
// For the sake of demonstration, we'll assume a way to access the 'accounts' array from accountsController
// or pass it in. For simplicity, let's just make a mock version for this file.
// In a real app, you'd use a service layer to abstract database access.
let mockAccounts = []; // Simulating data that would be in a DB
// This function would be called to set the accounts data, e.g., in server.ts
const setMockAccounts = (data) => {
    mockAccounts = data;
};
exports.setMockAccounts = setMockAccounts;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    // Find the user by email (simulating a database lookup)
    // IMPORTANT: In a real app, you'd query a database here.
    // For demonstration, we'll just check our temporary 'mockAccounts' array.
    const userAccount = mockAccounts.find(account => account.email === email);
    if (!userAccount) {
        return res.status(401).json({ error: 'Invalid credentials.' }); // User not found
    }
    // Compare the provided password with the stored hash
    const passwordMatch = yield (0, passwordService_1.comparePassword)(password, userAccount.passwordHash);
    if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials.' }); // Password doesn't match
    }
    // --- Authentication Token Generation (Next Substep!) ---
    // For now, we'll just send a success message.
    // In the next step, we'll generate a JWT token here.
    res.status(200).json({ message: 'Login successful!', accountNumber: userAccount.accountNumber });
});
exports.loginUser = loginUser;
