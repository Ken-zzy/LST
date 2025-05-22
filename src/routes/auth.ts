// src/routes/auth.ts
import express from 'express';
import { loginUser } from '../controllers/authController'; // Make sure this import is correct

const router = express.Router(); // <--- Create an Express Router instance

// Attach the loginUser controller to the /login POST endpoint of this router
router.post('/login', loginUser as express.RequestHandler);

export default router; // <--- Export the router, not the controller function directly