const express = require('express');
const db = require('./db/db');
var cron = require('node-cron');
const router = express.Router();
const cors = require('cors');
const rsa = require('./rsa')
const des = require('crypto-js');
// const encryption_db_handler = require('./encryption_db_handler')


// const mysql = require('mysql2');
// const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const staffRoutes = require('./routes/staff.routes');
const studentRoutes = require('./routes/student.routes');
const keyRoutes = require('./routes/keys.routes');
const docRoutes = require('./routes/doc.routes');
const { encryption_db_handler } = require('./encryption_db_handler');

const app = express();
app.use(express.json());
app.use(cors());

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/keys', keyRoutes);
app.use('/api/upload', docRoutes)



app.get('/', (req, res) => {
    res.send("School Server is up and running !");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})




///// PERIODIC KEY UPDATE HANDLERS ----------------------------------|||


cron.schedule('* * 5 * * *', async () => {
        // sec min hr day week month
    console.log("Running cron.schedule ...")
    
    try {

        let rsa_keys = rsa.generateKeys()
        let des_key =  des.lib.WordArray.random(8).toString();
    
        // run update database with new des key
        await updateRSA(rsa_keys)
        console.log("Updated RSA Keys")

        await updateDES(des_key)
        console.log("Updated DES key")
        // db.query(des_sql, des_key)
        // console.log("UPDATED DES KEY")
        await encryption_db_handler()
        
    } catch (err) {
        console.error('Error during cron.schedule execution:', err)
    }
})


function updateRSA(rsa_keys) {
    console.log("updating RSA keys")
    return new Promise((resolve, reject) => {
        db.query(`INSERT into rsa_keys (key_pub, key_priv) values (?, ?)`, [rsa_keys[0], rsa_keys[1]] , (err, results) => {
            if(err) {
                reject(err);
            } else {
                resolve(results)
            }
        })
    })
}
function updateDES(des_key) {
    return new Promise((resolve, reject) => {
        db.query(`INSERT into des_key (key_value) values (?)`, [des_key] , (err, results) => {
            if(err) {
                reject(err);
            } else {
                resolve(results)
            }
        })
    })
}