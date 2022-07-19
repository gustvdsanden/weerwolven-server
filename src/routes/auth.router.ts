import { login, signUp } from '../controllers/auth.controller';
import express from 'express';

export const router = express.Router();

router.route('/login/signup').post(signUp);
router.route('/login').post(login);
