// staff.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db/db');
const rsa = require('../rsa')

// GET all students
router.get('/students', (req, res) => {

    const sql = 'select stu_id, fname, lname, dept from student';

    db.query(sql, (err, res) => {
        if (err) {
            return res.status(500).json({ error: err.message});
        }
        res.json(result);
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

    db.query(sql, [stu_id], (err, results) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
    console.log(`made GET student with id: ${stu_id}`);
})

// GET ALL REQUESTS
router.get('/students/requests', (req, res) => {

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
router.get('/students/requests/:req_id', (req, res) => {
    const { req_id } = req.params;

    sql = `
    SELECT * from requests
    WHERE req_id = ?
    `

    db.query(sql, req_id, (err, results) => {
        if(err) {
            return res.status(500).json({error: err.message});
        }
        res.json(results);
    })
    console.log(`Fetched request #${req_id}`);
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
router.put('/students/grades/:stu_id', (req, res) => {
    const { stu_id } = req.params;
    const { gpa, cgpa } = req.body;

    let grade = []
    let values = []

    if (gpa !=  undefined) {
        grade.push('gpa = ?');
        values.push(gpa);
    }
    if (cgpa !=  undefined) {
        grade.push('cgpa = ?');
        values.push(cgpa);
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