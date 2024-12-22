// staff.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db/db');
const rsa = require('../rsa')
const des = require('../des')

// GET all students
router.get('/students', (req, res) => {

    const sql = 'select * from student';

    db.query(sql, async (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message});
        }
        const data = results
        // console.log("encrypted data: ", data)
        for (let i = 0; i < data.length; i++) {
            data[i].fname = await des.decrypt(data[i].fname)
            data[i].lname = await des.decrypt(data[i].lname)
            data[i].email = await des.decrypt(data[i].email)
            data[i].pwd = await des.decrypt(data[i].pwd)
            data[i].dept = await des.decrypt(data[i].dept)
            data[i].gpa = await des.decrypt(data[i].gpa)
            data[i].cgpa = await des.decrypt(data[i].cgpa)
            if (data[i].transcript_info) {
                data[i].transcript_info = await des.decrypt(data[i].transcript_info)
            }
        }
        res.json(data);
    });
    console.log("made GET All students request")
});

// get specific student
router.get('/students/:stu_id', (req, res) => {
    const { stu_id } = req.params;

    const sql = `
    select * from student
    where stu_id = ?
    `

    db.query(sql, [stu_id], async (err, results) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }
        const data = results
        console.log("encrypted data: ", data)
        data[0].fname = await des.decrypt(data[0].fname)
        data[0].lname = await des.decrypt(data[0].lname)
        data[0].email = await des.decrypt(data[0].email)
        data[0].pwd = await des.decrypt(data[0].pwd)
        data[0].dept = await des.decrypt(data[0].dept)
        data[0].gpa = await des.decrypt(data[0].gpa)
        data[0].cgpa = await des.decrypt(data[0].cgpa)
        // data[0].transcript_info = await des.decrypt(data[0].transcript_info)
        res.json(data);
    });
    console.log(`made GET student with id: ${stu_id}`);
})

router.put('/students/:stu_id', async (req, res) => {

    const { stu_id } = req.params;
    const {gpa, cgpa} = req.body;
    console.log(req.params)


    const enc_gpa = await des.encrypt(gpa)
    const enc_cgpa = await des.encrypt(cgpa)
    // const enc_lname = await des.encrypt(lname)

    const sql = `
    UPDATE student set gpa = ?, cgpa = ?
    where stu_id = ?
    `

    console.log(enc_gpa)

    db.query(sql, [enc_gpa, enc_cgpa, stu_id], async (err, results) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }
        const data = results
        res.json(data);
    });
    console.log(`made UPDATE student GPA/CGPA with id: ${stu_id}`);
});

// GET ALL REQUESTS
router.get('/requests', (req, res) => {
    console.log("getting requests...")

    sql = `SELECT * from requests`

    db.query(sql, (err, results) => {
        if(err) {
            return res.status(500).json({error: err.message});
        }
        res.json(results);
    });
    console.log(`made GET all student requests`);
});

// GET specific request
router.get('/requests/:stu_id', (req, res) => {
    const { stu_id } = req.params;

    sql = `
    SELECT * from requests
    WHERE stu_id = ?
    `

    db.query(sql, stu_id, (err, results) => {
        if(err) {
            return res.status(500).json({error: err.message});
        }
        res.json(results);
    })
    console.log(`Fetched request for student #${stu_id}`);
})

router.post('/students/requests/upload/:req_id', (req, res) => {
    const { req_id } = req.params
    const { doc } = body.params
    
    sql = `
    UPDATE requests SET doc = ?
    WHERE req_id = ?
    `

    db.query(sql, [doc, req_id], (req, result) => {
        if(err) {
            return res.status(500).json({error: err.message});
        }
        res.json(results);
    })
    console.log(`Uploaded Document #${req_id}`);
})


// REQUEST COMPLETION
router.put('/students/requests/status/:req_id', (req, res) => {
    const { req_id } = req.params;

    sql = `
    UPDATE requests SET completed = True
    WHERE req_id = ?
    `

    db.query(sql, req_id, (err, results) => {
        if(err) {
            return res.status(500).json({error: err.message});
        }
        res.json(results);
    })
    console.log(`Completed Request #${req_id}`);
})

// UPDATE GPA / CGPA
router.put('/students/grades/:stu_id', async (req, res) => {
    const { stu_id } = req.params;
    const { gpa, cgpa } = req.body;

    let grade = []
    let values = []

    if (gpa !=  undefined) {
        grade.push('gpa = ?');
        values.push(await des.encrypt(gpa));
    }
    if (cgpa !=  undefined) {
        grade.push('cgpa = ?');
        values.push(await des.encrypt(cgpa));
    }

    values.push(stu_id)

    console.log(grade.join(', '))
    const sql = `
    UPDATE student SET ${grade.join(', ')}
    WHERE stu_id = ?`;

    db.query(sql, values, (err, result) => {
        if(err) {
            return res.status(500).json({error: err.message});
        }
        res.json({message: `STUDENT ${stu_id} gpa and/or cgpa updated`})
    })
})

// SEND DOCUMENT
router.put('/students/requests/:req_id', (req, res) => {
    console.log("send doc")
    const { req_id } = req.params
    
    sendDocument(req_id)
    
})

async function sendDocument(req_id) {
    const studentID = await getRequestID(req_id)
    console.log(studentID)
    const studentData = await getStudent(studentID)
    console.log(studentData)

    const document = rsa.generateSignature("s", studentData)
    console.log(document)

    sql = `UPDATE requests SET document = ? WHERE req_id = ?`

    db.query(sql, [document, req_id])

}

async function getRequestID(id) {
    try {
        const response = await fetch(`http://localhost:5000/api/staff/students/requests/${id}`, 
            {
                method: "GET"
            })
        
        const result = await response.json()
        if (response.ok) {
            console.log(result)
        } else {
            console.error("error getting student ",result.error)
        }    
        return result[0].stu_id

    } catch (error) {
        console.error('error getting student', error);
    }
}

async function getStudent(id) {
    try {
        const response = await fetch(`http://localhost:5000/api/staff/students/${id}`, 
            {
                method: "GET"
            })
        
        const result = await response.json()
        if (response.ok) {
            console.log(result)
        } else {
            console.error("error getting student ",result.error)
        }    
        return JSON.stringify(result)

    } catch (error) {
        console.error('error getting student', error);
    }
}


module.exports = router;