const express = require('express')
const router = express.Router()
const jwt = require("jsonwebtoken")
const db = require('../db/db')

const des = require('../encryption_db_handler')
const { decrypt } = require('../des')

router.post("/login", async (req, res) => {
    const { des_key, email, pwd, role } = req.body;

    try {
        // Verify DES key
        const response = await des.getDES_key();
        if (des_key !== response.key) {
            return res.status(400).json({ message: "DES KEY NOT MATCHING" });
        }
        console.log("DES KEY MATCH");

        // Log input details
        console.log("role:", role);
        console.log("email:", email);

        if (role === "sysadmin") {
            const admin_id = email;
            const sql = `SELECT admin_usr, admin_pwd FROM sysadmin WHERE admin_usr = ?`;

            db.query(sql, admin_id, (err, results) => {
                if (err) return res.status(500).json({ message: "Database error", error: err });

                if (results.length === 0 || results[0].admin_pwd !== pwd) {
                    return res.status(400).json({ message: "Invalid admin credentials" });
                }

                console.log("ADMIN LOGGED IN");
                res.send("ADMIN LOGGED IN");
            });
        } else if (role === "student" || role === "staff") {
            const idField = role === "student" ? "stu_id" : "sf_id";
            const sql = `SELECT ${idField}, pwd FROM ${role} WHERE ${idField} = ?`;

            db.query(sql, [email], async (err, results) => {
                if (err) return res.status(500).json({ message: "Database error", error: err });

                if (results.length === 0) {
                    return res.status(400).json({ message: `${role} not found` });
                }

                const userData = results[0];
                const decryptedPwd = await decrypt(userData.pwd);

                if (decryptedPwd === pwd) {
                    console.log("PASSWORD MATCH");
                    res.send(`LOGGED IN AS ${role.toUpperCase()}`);
                } else {
                    res.status(400).json({ message: "Invalid credentials" });
                }
            });
        } else {
            res.status(400).json({ message: "Invalid role" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


module.exports = router