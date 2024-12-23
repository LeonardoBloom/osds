const express = require('express')
const router = express.Router()
const jwt = require("jsonwebtoken")
const db = require('../db/db')

const des = require('../encryption_db_handler')
const { decrypt } = require('../des')

router.post("/login", async (req, res) => {
    const {des_key, email, pwd, role} = req.body

    const response = await des.getDES_key()

    if (des_key == response.key) {
        console.log("DES KEY MATCH")
    }

    console.log("role", role)
    console.log("email", email)
    console.log("pwd", pwd)

    
    if (role == "sysadmin") {
        let admin_id = email
        sql = `SELECT admin_usr, admin_pwd from sysadmin where admin_usr = ?`
    
        db.query(sql, admin_id, async (err, results) => {
            const data = results
            // console.log("data:")
            // console.log(data[0].admin_usr)
            // console.log(data[0].admin_pwd)

            if(data[0].admin_pwd == pwd) {
                res.send("ADMIN LOGGED IN")
            } else {
                res.send("wrong admin pwd")
            }
            
        })

    } else {
        let p_id = email

        let id = ""

        if(role == "student") {
            id = "stu_id"
        } else {
            id = "sf_id"
        }

        console.log("id is", id)

        sql = `SELECT ${id}, pwd from ${role} where ${id} = ? `
    
        db.query(sql, [p_id], async (err, results) => {
            const data = results
            if(id == "stu_id") {
                console.log(data)
                // data[0].stu_id = await decrypt(data[0].stu_id)
                if (data[0].stu_id) {
                    console.log("ID MATCH")
                    pass = await decrypt(data[0].pwd)
                    if (pass == pwd) {
                        console.log("PASSWORD MATCH")
                        res.send("LOGGED IN AS STUDENT")
                    } else {
                        res.status(500).json({ message: "LOGIN FAILED"});
                    }
                }
                
            } else {
                console.log(data)
                // data[0].sf_id = await decrypt(data[0].sf_id)
                if (data[0].sf_id) {
                    console.log("ID MATCH")
                    pass = await decrypt(data[0].pwd)
                    if (pass == pwd) {
                        console.log("PASSWORD MATCH")
                        res.send("LOGGED IN AS STAFF")
                    } else {
                        res.status(500).json({ message: "LOGIN FAILED"});
                    }
                }
            }
        })
    }

})

module.exports = router