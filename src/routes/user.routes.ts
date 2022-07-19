import { getAllUsers } from '../controllers/user.controller';

import express from 'express';

export const router = express.Router();

router.route('/').get(getAllUsers);
