import db from "../sql.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, pic } = req.body;
        console.log(firstName);
        console.log(lastName);
        console.log(email);
        console.log(password);
        console.log(phone);
        console.log(pic);

        if (!firstName || !lastName || !email || !password || !phone) {
            res.status(400);
            throw new Error('Please enter all the fields.');
        }

        const isUserExistsQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(isUserExistsQuery, [email], (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.length) {
                res.status(400)
                throw new Error('User already exists!');
            }
        });


        // Regular expression to enforce name complexity
        const nameRegex = /^(?=(?:\S+\s*){3,20}$)[A-Za-z\s]{3,20}$/;

        // Check if name meets complexity requirements
        if (!nameRegex.test(firstName)) {
            res.status(400).json({ error: 'First name should be only alphabetic characters and length between 3 and 20 characters' });
        }
        if (!nameRegex.test(lastName)) {
            res.status(400).json({ error: 'Last name should be only alphabetic characters and length between 3 and 20 characters' });
        }

        // Regular expression to enforce password complexity
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,15}$/;

        // Check if password meets complexity requirements
        if (!passwordRegex.test(password)) {
            res.status(400).json({ error: 'Password must contain at least 8 characters, including at least 1 uppercase letter, 1 lowercase letter, 1 number and atleast 1 special character.' });;
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const createUserQuery = 'INSERT INTO users (`firstName`, `lastName`, `email`, `password`, `phone`, `pic`) VALUES (?, ?, ?, ?, ?, ?)';

        db.query(createUserQuery, [
            firstName,
            lastName,
            email,
            passwordHash,
            phone,
            pic
        ], (err, data) => {
            if (err) return res.status(500).json(err)
            console.log(data);
            const token = jwt.sign({ id: data.insertId }, process.env.JWT_SECRET);
            res.status(200).json(
                {
                    token,
                    user: { id: data.insertId, firstName, lastName, email, phone, pic },
                    msg: 'Registration Successful!'
                }
            );
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            res.status(404).json({ error: "Enter all the fields." });
        }
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [req.body.email], (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.length === 0) {
                res.status(404).json({ error: "Invalid credentials." });
            }

            if (!req.body.password || !data[0].password) {
                res.status(404).json({ error: "Invalid credentials." });
            }

            const isMatch = bcrypt.compareSync(req.body.password, data[0].password);

            if (!isMatch) {
                res.status(404).json({ error: "Invalid credentials." });
            }

            const { password, ...user } = data[0];
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

            res.status(200).json({ token, user, msg: 'Login Successful!' });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const socialLogin = (req, res) => {
    const { user } = req.body;

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);


    res.status(200).json({ token, user, msg: 'Login Successful!' });
} 