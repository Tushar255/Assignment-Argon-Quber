import jwt from 'jsonwebtoken'
import db from '../sql.js';

const fetchUserDataById = (userId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT id, firstName, lastName, email, phone FROM users WHERE id = ?';
        db.query(query, [userId], (err, data) => {
            if (err) {
                reject(err);
            } else if (data.length === 0) {
                resolve(null);
            } else {
                const id = data[0].id;
                const firstName = data[0].firstName;
                const lastName = data[0].lastName;
                const email = data[0].email;
                const phone = data[0].phone;
                const user = { id, firstName, lastName, email, phone };
                resolve(user);
            }
        });
    });
};


const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            fetchUserDataById(decoded.id)
                .then((user) => {
                    req.user = user;
                    next();
                })
                .catch((error) => {
                    console.log(error);
                    res.status(401).json({ error: "Not authorized, token failed" });
                });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    if (!token) {
        res.status(401).json({ error: "Not authorized, no token" });
    }
};

export default protect;