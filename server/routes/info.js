import express from 'express'
import { createNewUserInfo, getUserInfo, resetInfo, updateDescription, updateEducation, updateExperience, updateSkills } from '../controllers/info.js';
import protect from '../authentication/Auth.js';

const router = express.Router();

router.route('/').post(protect, createNewUserInfo);
router.route('/info').get(protect, getUserInfo);
router.route('/reset').post(protect, resetInfo);

router.route('/update/description').put(protect, updateDescription);
router.route('/update/skills').put(protect, updateSkills);
router.route('/update/education').put(protect, updateEducation);
router.route('/update/experience').put(protect, updateExperience);

export default router;