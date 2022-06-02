import { getAllRoles } from '../controllers/role.controller';
import express from 'express';

export const router = express.Router();

router.route('/').get(getAllRoles);
