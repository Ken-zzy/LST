// src/routes/utility.ts
import express from 'express';
import { decryptDataEndpoint } from '../controllers/utilityController';

const router = express.Router();

// Define a POST route for decryption
router.post('/decrypt', decryptDataEndpoint as express.RequestHandler);

export default router;