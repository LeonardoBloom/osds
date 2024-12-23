// admin.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db/db');
const des = require('../des')

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

    db.query(sql, async (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message});
        }
        const data = result
                // console.log("encrypted data: ", data)
                for (let i = 0; i < data.length; i++) {
                    data[i].fname = await des.decrypt(data[i].fname)
                    data[i].lname = await des.decrypt(data[i].lname)
                    data[i].dept = await des.decrypt(data[i].dept)
                }
                res.json(data);
    });
    console.log("made GET All staff request")
});

router.get('/staff/:sf_id', (req, res) => {
    const { sf_id } = req.params;

    const sql = `
    select * from staff
    where sf_id = ?
    `

    db.query(sql, [sf_id], async (err, results) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }
        const data = results
        console.log("encrypted data: ", data)
        data[0].fname = await des.decrypt(data[0].fname)
        data[0].lname = await des.decrypt(data[0].lname)
        data[0].email = await des.decrypt(data[0].email)
        data[0].dept = await des.decrypt(data[0].dept)

        res.json(data);
    });
    console.log(`made GET staff with id: ${sf_id}`);
})

router.put('/staff/:sf_id', async (req, res) => {

    const { sf_id } = req.params;
    const {email, fname, lname} = req.body;
    console.log(req.body)


    const enc_email = await des.encrypt(email)
    const enc_fname = await des.encrypt(fname)
    const enc_lname = await des.encrypt(lname)

    const sql = `
    UPDATE staff set fname = ?, lname = ?, email = ? 
    where sf_id = ?
    `

    console.log(enc_email)

    db.query(sql, [enc_fname, enc_lname, enc_email, sf_id], async (err, results) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }
        const data = results
        res.json(data);
    });
    console.log(`made UPDATE staff with id: ${sf_id}`);
});

router.post('/students/add', async (req, res) => {

    try {

        const { id, fname, lname, email, pwd, dept } = req.body;

        const enc_fname = await des.encrypt(fname)
        console.log("enc fname: ", enc_fname)
        const enc_lname = await des.encrypt(lname)
        const enc_email = await des.encrypt(email)
        const enc_pwd = await des.encrypt(pwd)
        const enc_dept = await des.encrypt(dept)
        const enc_gpa = await des.encrypt('0')
        const enc_cgpa = await des.encrypt('0')
    
    
        const sql = 'INSERT INTO student (stu_id, fname, lname, email, pwd, dept, gpa, cgpa) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
        db.query(sql, [id, enc_fname, enc_lname, enc_email, enc_pwd, enc_dept, enc_gpa, enc_cgpa], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message});
            }
            res.status(201).json({ message: `student: ${id} - ${fname, " ", lname} added SUCCESSFULLY!`});
        });

    } catch (error) {

    }
});

router.post('/staff/add', async (req, res) => {

    const { fname, lname, email, pwd, dept } = req.body;

    console.log(fname)
    const enc_fname = await des.encrypt(fname)
    const enc_lname = await des.encrypt(lname)
    const enc_email = await des.encrypt(email)
    const enc_pwd = await des.encrypt(pwd)
    const enc_dept = await des.encrypt(dept)

    const sql = 'INSERT INTO staff ( fname, lname, email, pwd, dept) VALUES ( ?, ?, ?, ?, ?)';

    db.query(sql, [enc_fname, enc_lname, enc_email, enc_pwd, enc_dept], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message});
        }
        res.status(201).json({ message: `staff: ${fname} ${lname} added SUCCESSFULLY!`});
    });
});

module.exports = router;
