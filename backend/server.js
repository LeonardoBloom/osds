const express = require('express');
const db = require('./db/db');
var cron = require('node-cron');
const router = express.Router();
const rsa = require('./rsa')


// const mysql = require('mysql2');
// const cors = require('cors');

// const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin.routes');
const staffRoutes = require('./routes/staff.routes');
// const studentRoutes = require('./routes/student.routes');
const keyRoutes = require('./routes/keys.routes');

const app = express();
app.use(express.json());
// app.use(cors());

app.use('/api/admin', adminRoutes);
app.use('/api/staff', staffRoutes);
// app.use('/api/student', studentRoutes);
app.use('/api/keys', keyRoutes);


app.get('/', (req, res) => {
    res.send("School Server is up and running !");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

cron.schedule('* * 1 * * *', () => {
    // console.log(keys[1])
    // console.log(keys[0])
    console.log("Running cron.schedule ...")
    
    let rsa_keys = rsa.generateKeys()
    // let des_key = des.generateKey()


    rsa_sql = `
    UPDATE rsa_keys SET key_pub = ?, key_priv = ?
    WHERE key_id = 1
    `
    des_sql = `
    UPDATE des_key SET key_value = ?
    WHERE key_id = 1
    `


    db.query(rsa_sql, [rsa_keys[0], rsa_keys[1]])
    console.log("Updated RSA Keys")
    // db.query(des_sql, des_key)
    // console.log("UPDATED DES KEY")
})
