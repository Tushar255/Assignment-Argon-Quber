import express from 'express'
import { createNewUserInfo, getUserInfo } from '../controllers/info.js';
import protect from '../authentication/Auth.js';

const router = express.Router();

router.route('/').post(protect, createNewUserInfo);
router.route('/info').get(protect, getUserInfo);

export default router;