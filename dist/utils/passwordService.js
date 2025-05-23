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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const bcrypt_1 = __importDefault(require("bcrypt"));
// The 'salt rounds' determine how much work is needed to calculate the hash.
// Higher numbers are more secure but slower. 10-12 is a common recommendation.
const SALT_ROUNDS = 10;
/**
 * Hashes a plain-text password using bcrypt.
 * @param password The plain-text password to hash.
 * @returns A promise that resolves with the hashed password string.
 */
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        // bcrypt.hash() takes the password and the salt rounds.
        // It automatically generates a unique salt for each hash.
        return yield bcrypt_1.default.hash(password, SALT_ROUNDS);
    });
}
/**
 * Compares a plain-text password with a hashed password.
 * @param password The plain-text password provided by the user (e.g., during login).
 * @param hashedPassword The hashed password retrieved from the database.
 * @returns A promise that resolves to true if the passwords match, false otherwise.
 */
function comparePassword(password, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        // bcrypt.compare() takes the plain-text password and the hashed password.
        // It re-hashes the plain-text password with the salt extracted from the hashed password
        // and compares the result.
        return yield bcrypt_1.default.compare(password, hashedPassword);
    });
}
