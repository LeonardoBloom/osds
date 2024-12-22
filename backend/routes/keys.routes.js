const express = require('express');
const router = express.Router();
const db = require('../db/db');

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

module.exports = router