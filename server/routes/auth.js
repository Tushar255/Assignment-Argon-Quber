import express from 'express'
import { login, registerUser, socialLogin } from '../controllers/auth.js';
import passport from 'passport';

const router = express.Router();

router.route('/').post(registerUser);
router.route('/login').post(login);
router.route('/social-login').post(socialLogin);

const FAILURE_URL = "https://main--resonant-creponne-e01484.netlify.app";

router.get('/linkedin',
    passport.authenticate('linkedin', {
        failureRedirect: FAILURE_URL
    })
);

router.get('/linkedin/callback',
    passport.authenticate('linkedin'),
    (req, res) => {
        const user = req.user;
        const serializedUser = encodeURIComponent(JSON.stringify(user));
        res.redirect(`https://main--resonant-creponne-e01484.netlify.app/social-login/${serializedUser}`);
    }
);
router.get('/twitter',
    passport.authenticate('twitter', {
        scope: ['profile'],
        failureRedirect: FAILURE_URL
    })
);

router.get('/twitter/callback',
    passport.authenticate('twitter'),
    (req, res) => {
        const user = req.user;
        const serializedUser = encodeURIComponent(JSON.stringify(user));
        res.redirect(`https://main--resonant-creponne-e01484.netlify.app/social-login/${serializedUser}`);
    }
);

router.get('/logout', (req, res) => {
    req.logout();
    res.status(200).json('Logout Successfully')
})

export default router;