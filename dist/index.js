"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const accounts_1 = __importDefault(require("./routes/accounts"));
const auth_1 = __importDefault(require("./routes/auth"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const key = process.env.ENCRYPTION_KEY;
console.log('--- Environment Variables Loaded ---');
console.log('ENCRYPTION_KEY:', process.env.ENCRYPTION_KEY ? '****** (loaded)' : 'NOT LOADED');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '****** (loaded)' : 'NOT LOADED');
console.log('----------------------------------');
const app = (0, express_1.default)();
const port = 4000;
app.use(body_parser_1.default.json());
const MONGODB_URI = process.env.MONGODB_URI; // This will now get the correct string from .env
if (!MONGODB_URI) {
    console.error('CRITICAL ERROR: MONGODB_URI environment variable is not set.');
    process.exit(1);
}
mongoose_1.default.connect(MONGODB_URI) // This is where Mongoose connects
    .then(() => {
    console.log('Connected to MongoDB Atlas!');
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
})
    .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});
app.use('/', accounts_1.default); // Mount the accounts router
app.use('/', auth_1.default);
