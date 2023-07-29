import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieSession from 'cookie-session';
import passport from 'passport';
import TwitterStrategy from 'passport-twitter'
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import mongoConnect from './mongodb.js';
import authRoutes from './routes/auth.js'
import infoRoutes from './routes/info.js'
import db from './sql.js';
import jwt from 'jsonwebtoken'
import path from 'path'

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(express.static(path.resolve(__dirname, 'dist')))
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieSession(
    {
        name: "session",
        keys: ["tsb25"],
        maxAge: 24 * 60 * 60 * 100 // 1-Day
    }
));
app.use(passport.initialize());
app.use(passport.session());


// LINKEDIN
passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_KEY,
    clientSecret: process.env.LINKEDIN_SECRET,
    callbackURL: "/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_liteprofile'],
}, function(accessToken, refreshToken, profile, cb) {
    // At this point, the LinkedIn profile data is available in the 'profile' variable.
    const email = profile.emails[0].value;

    const findUserByEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(findUserByEmailQuery, [email], (err, emailResults) => {
        if (err) {
            return cb(err);
        }

        // If user with the email exists
        if (emailResults.length > 0) {
            const user = emailResults[0];
            user.token = accessToken; // Use the LinkedIn access token as the 'token' property in the user object
            return cb(null, user);
        } else {
            // If no user with the email exists, create a new user record in the database
            const { displayName } = profile;
            const firstName = displayName.split(' ')[0];
            const lastName = displayName.split(' ').slice(1).join(' ');

            const createUserQuery = 'INSERT INTO users (`firstName`, `lastName`, `email`) VALUES (?, ?, ?)';

            db.query(createUserQuery, [firstName, lastName, email], (err, insertResult) => {
                if (err) {
                    return cb(err);
                }

                const newUser = {
                    token: accessToken, // Use the LinkedIn access token as the 'token' property in the user object
                    id: insertResult.insertId,
                    firstName: firstName,
                    lastName: lastName,
                    email: email
                };

                // Send the response with token and user data
                return cb(null, newUser);
            });
        }
    });
}));


// TWITTER
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "/auth/twitter/callback",
    includeEmail: true
},
function(token, tokenSecret, profile, cb) {
    const email = profile.emails[0].value;

    const findUserByEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(findUserByEmailQuery, [email], (err, emailResults) => {
    if (err) {
        return cb(err);
    }

    // If user with the email exists
    if (emailResults.length > 0) {
        const user = emailResults[0];
        user.token = token;
        return cb(null, user);
    } else {
        // If no user with the email exists, create a new user record in the database
        const { displayName } = profile;
        const firstName = displayName.split(' ')[0];
        const lastName = displayName.split(' ').slice(1).join(' ');
        
        const createUserQuery = 'INSERT INTO users (`firstName`, `lastName`, `email`) VALUES (?, ?, ?)';
        
        db.query(createUserQuery, [
            firstName,
            lastName,
            email
        ], (err, insertResult) => {
            if (err) {
                return cb(err);
            }

            const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);

            const newUser = {
                token: token,
                id: insertResult.insertId,
                firstName: firstName,
                lastName: lastName,
                email: email
            };

            // Send the response with token and user data
            return cb(null, newUser);
        });
    }
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log(id);
    const findUserQuery = 'SELECT * FROM users WHERE id = ?';
    db.query(findUserQuery, [id], (err, results) => {
        if (err) {
            return done(err);
        }

        if (results.length > 0) {
            const user = JSON.parse(JSON.stringify(results[0]));
            return done(null, user);
        } else {
            return done(new Error('User not found'));
        }
    });
});

// ROUTES
app.use('/auth', authRoutes);
app.use('/info', infoRoutes);


// CONNECTION
mongoConnect(app);