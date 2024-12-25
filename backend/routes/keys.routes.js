const express = require('express');
const router = express.Router();
const db = require('../db/db');

const rsa = require('../rsa');
const des = require('crypto-js');

const key_handler = require('../encryption_db_handler')

router.get('/rsa/getkeys', (req, res) => {

    sql = `select key_pub, key_priv from rsa_keys`

    db.query(sql, (err, result) => {
        if(err) {
            return res.status(500).json({ error: err.message});
        }
        res.json(result);
    })
    console.log("made GET RSA Keys request")
})

router.get('/getDes', async (req, res) => {

    console.log("made get des")

    const des = await key_handler.getDES_key()

    console.log(des)

    res.send(des)
})

router.get('/rsa/pubkey', (req, res) => {
    sql = `select key_pub from rsa_keys`

    db.query(sql, (err, result) => {
        if(err) {
            return res.status(500).json({ error: err.message});
        }
        res.json(result);
    })
    console.log("made GET pubkey request")
})

router.post('/update/:mode', async (req, res) => {

    const {mode} = req.params

    console.log("server keys update")

    if(mode == "rsa") {
        let rsa_keys = rsa.generateKeys()
        await updateRSA(rsa_keys)
        console.log("Updated RSA Keys")

        await key_handler.rsa_update()
        console.log("rsa updated in server")
        res.status(200).json({ message: "Success RSA"});


    } else if (mode == "des") {
        let des_key =  des.lib.WordArray.random(8).toString();

        await updateDES(des_key)
        console.log("Updated DES key")

        await key_handler.encryption_db_handler()
        console.log("DES updatedssss")
        res.status(200).json({ message: "Success DES"});

    } else {
        res.status(500).json({ message: "FAILED KEY UPDATE" });

    }
})

module.exports = router

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