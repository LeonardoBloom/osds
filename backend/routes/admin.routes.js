// admin.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/students', (req, res) => {

    const sql = 'select stu_id, fname, lname, dept from student';

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message});
        }
        res.json(result);
    });
    console.log("made GET All students request")
});
router.get('/staff', (req, res) => {

    const sql = 'select * from staff';

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message});
        }
        res.json(result);
    });
    console.log("made GET All staff request")
});

router.post('/students/add', (req, res) => {

    const { id, fname, lname, email, pwd, dept } = req.body;

    const sql = 'INSERT INTO student (stu_id, fname, lname, email, pwd, dept) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(sql, [id, fname, lname, email, pwd, dept], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message});
        }
        res.status(201).json({ message: `student: ${id} - ${fname, " ", lname} added SUCCESSFULLY!`});
    });
});

router.post('/staff/add', (req, res) => {

    const { fname, lname, email, pwd, dept } = req.body;

    const sql = 'INSERT INTO staff ( fname, lname, email, pwd, dept) VALUES ( ?, ?, ?, ?, ?)';

    db.query(sql, [fname, lname, email, pwd, dept], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message});
        }
        res.status(201).json({ message: `staff: ${fname} ${lname} added SUCCESSFULLY!`});
    });
});

module.exports = router;
