"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.ts
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController"); // Make sure this import is correct
const router = express_1.default.Router(); // <--- Create an Express Router instance
// Attach the loginUser controller to the /login POST endpoint of this router
router.post('/login', authController_1.loginUser);
exports.default = router; // <--- Export the router, not the controller function directly
