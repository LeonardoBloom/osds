const mysql = require('mysql2');

// create the SQL (database) connection
const db = mysql.createConnection( {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'school_db'
});

// check sql connetion
db.connect ((err) => {
    if (err) throw err;
    console.log("SUCCESSFULLY Connected to the MySQL Database")
});

module.exports = db