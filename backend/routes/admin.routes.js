// admin.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/students', (req, res) => {

    const sql = 'select * from sysadmin';

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message});
        }
        res.json(result);
    });
    console.log("made GET All students request")
});

router.post('/add', (req, res) => {

    const { name, id } = req.body;

    const sql = 'INSERT INTO sysadmin (student_id, student_name) VALUES (?, ?)';

    db.query(sql, [id, name], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message});
        }
        res.status(201).json({ message: `student: "${id} - ${name}" added SUCCESSFULLY!`});
    });
});

module.exports = router;
