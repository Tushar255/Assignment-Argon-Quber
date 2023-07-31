import express from 'express'
import { login, registerUser, socialLogin } from '../controllers/auth.js';
import passport from 'passport';

const router = express.Router();

router.route('/').post(registerUser);
router.route('/login').post(login);
// router.route('/social-login').post(socialLogin);

const CLIENT_URL = "https://main--resonant-creponne-e01484.netlify.app/social-login";

router.get('/linkedin', passport.authenticate('linkedin'));

router.get('/linkedin/callback',
    passport.authenticate('linkedin', {
        successRedirect: CLIENT_URL,
        failureRedirect: '/login/failure'
    }),
);

router.get('/twitter', passport.authenticate('twitter', { scope: ['profile'] }));

router.get('/twitter/callback',
    passport.authenticate('twitter'), (req, res) => {
        res.redirect('/social-login')
    }
);
// router.get('/twitter/callback',
//     passport.authenticate('twitter', {
//         successRedirect: CLIENT_URL,
//         failureRedirect: '/login/failure'
//     }),
// );

router.get('/social-login', (req, res) => {
    console.log(req.user);
    if (req.user) {
        res.status(200).json({ user: req.user });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});
// router.get('/login/success', (req, res) => {
//     if (req.user) {
//         res.status(200).json({ user: req.user });
//     } else {
//         res.status(401).json({ error: 'Unauthorized' });
//     }
// });

router.get('/login/failure', (req, res) => {
    res.status(200).json({ error: "Authentication failed."});
})

export default router;