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


dotenv.config();
const app = express();
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: "GET, POST, PUT, DELETE",
        credentials: true,
    })
);
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
    callbackURL: "http://localhost:4545/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_liteprofile'],
}, function (accessToken, refreshToken, profile, cb) {
    const email = profile.emails[0].value;

    const findUserByEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(findUserByEmailQuery, [email], (err, emailResults) => {
        if (err) {
            return cb(err);
        }

        // If user with the email exists
        if (emailResults.length > 0) {
            const user = emailResults[0];

            if (!user.pic) {
                const pic = profile.photos[3].value;
                const updateQuery = 'UPDATE users SET pic = ? WHERE id = ?';

                db.query(updateQuery, [pic, user.id], (err, result) => {
                    if (err) {
                        console.error('Error updating data:', err.message);
                    } else {
                        console.log('Data updated successfully:', result);
                    }
                })
            }

            return cb(null, user);
        } else {
            // create a new user record in the database
            const { displayName } = profile;
            const firstName = displayName.split(' ')[0];
            const lastName = displayName.split(' ').slice(1).join(' ');
            const pic = profile.photos[0].value;

            const createUserQuery = 'INSERT INTO users (`firstName`, `lastName`, `email`, `pic`) VALUES (?, ?, ?, ?)';

            db.query(createUserQuery, [firstName, lastName, email, pic], (err, insertResult) => {
                if (err) {
                    return cb(err);
                }

                const newUser = {
                    id: insertResult.insertId,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    pic: pic
                };

                return cb(null, newUser);
            });
        }
    });
}));


// TWITTER
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "http://localhost:4545/auth/twitter/callback",
    includeEmail: true
},
    function (token, tokenSecret, profile, cb) {
        const email = profile.emails[0].value;

        const findUserByEmailQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(findUserByEmailQuery, [email], (err, emailResults) => {
            if (err) {
                return cb(err);
            }

            // If user with the email exists
            if (emailResults.length > 0) {
                const user = emailResults[0];

                if (!user.pic) {
                    const pic = profile.photos[0].value;
                    const updateQuery = 'UPDATE users SET pic = ? WHERE id = ?';

                    db.query(updateQuery, [pic, user.id], (err, result) => {
                        if (err) {
                            console.error('Error updating data:', err.message);
                        } else {
                            console.log('Data updated successfully:', result);
                        }
                    })
                }

                return cb(null, user);
            } else {
                // create a new user record in the database
                const { displayName } = profile;
                const firstName = displayName.split(' ')[0];
                const lastName = displayName.split(' ').slice(1).join(' ');
                const pic = profile.photos[0].value;

                const createUserQuery = 'INSERT INTO users (`firstName`, `lastName`, `email`, `pic`) VALUES (?, ?, ?, ?)';

                db.query(createUserQuery, [
                    firstName,
                    lastName,
                    email,
                    pic
                ], (err, insertResult) => {
                    if (err) {
                        return cb(err);
                    }

                    const newUser = {
                        id: insertResult.insertId,
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        pic: pic
                    };

                    return cb(null, newUser);
                });
            }
        });
    }));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const findUserQuery = 'SELECT * FROM users WHERE id = ?';
    db.query(findUserQuery, [id], (err, results) => {
        if (err) {
            return done(err);
        }

        if (results.length > 0) {
            const user = JSON.parse(JSON.stringify(results[0]));
            console.log(user);
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