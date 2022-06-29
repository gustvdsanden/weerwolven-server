import { createLobby } from '../controllers/lobby.controller';
import express from 'express';

export const router = express.Router();

router.route('/create').get(createLobby);
