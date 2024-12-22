const express = require('express')
const router = express.Router()
const jwt = require("jsonwebtoken")

router.post("/login", async (req, res) => {
    const {des_key, email, pwd} = req.body

    console.log("login")

    res.json("success")

})

module.exports = router