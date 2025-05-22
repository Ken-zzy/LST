import express from 'express';
import { createAccount } from '../controllers/accountscontroller';
import { getAllAccounts } from '../controllers/accountscontroller';

const router = express.Router();

router.post('/accounts', createAccount as express.RequestHandler);
router.post('/', createAccount as express.RequestHandler); 
router.get('/', getAllAccounts as express.RequestHandler);

export default router;
