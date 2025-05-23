// File: src/index.ts
import express from 'express';
import bodyParser from 'body-parser';
import accountsRouter from './routes/accounts';
import authRouter from './routes/auth';
import utilityRouter from './routes/utility';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config();

const key = process.env.ENCRYPTION_KEY;

console.log('--- Environment Variables Loaded ---');
console.log('ENCRYPTION_KEY:', process.env.ENCRYPTION_KEY ? '****** (loaded)' : 'NOT LOADED');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '****** (loaded)' : 'NOT LOADED');
console.log('----------------------------------');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use(bodyParser.json());

const MONGODB_URI = process.env.MONGODB_URI; // This will now get the correct string from .env

if (!MONGODB_URI) {
  console.error('CRITICAL ERROR: MONGODB_URI environment variable is not set.');
  process.exit(1);
}

mongoose.connect(MONGODB_URI) // This is where Mongoose connects
  .then(() => {
    console.log('Connected to MongoDB Atlas!');
    app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`); // This log will now show the correct port
});
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to the Finable!!! We've saved the world😁" });
});

app.use('/', accountsRouter); 
app.use('/auth', authRouter);
app.use('/utility', utilityRouter);
