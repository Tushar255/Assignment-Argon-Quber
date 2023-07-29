import mysql from 'mysql'

const db = mysql.createConnection({
    host: "tushar-rds.c6ejhxgnsobl.ap-south-1.rds.amazonaws.com",
    user: "root",
    password: "Tu1$tushar",
    database: "user_schema"
})

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL');
});

export default db;