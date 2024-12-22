const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.post('/request', (req, res) => {

    const {stu_id, req_type } = req.body
    

    sql = `INSERT INTO requests (req_type, completed, stu_id) values (?, ?, ?)`

    db.query(sql, [req_type, 0, stu_id ], (err,result) => {
        if(err) {
            return res.status(500).json({ error: err.message});
        }
        res.json(result);
    })
    console.log("made TRANSCRIPT/CERTIFICATE request")
})

module.exports = router