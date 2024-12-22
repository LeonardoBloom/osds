const express = require('express');
const router = express.Router();
const multer = require('multer')
const db = require('../db/db');
const rsa = require('../rsa')

const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 } // Example: 10MB limit
  });
  

router.post('/doc/:req_id', async (req, res) => {
    
    const { req_id } = req.params
    const { doc } = req.body

    const fileSignature = await rsa.generateSignature("s", doc); 
    console.log(req.body)

    sql = `UPDATE requests SET document = ?, doc_rsa = ?, completed = 1 WHERE req_id = ?`

    db.query(sql, [doc, fileSignature, req_id])

    res.send("document sent")
    
});

// Handle invoice upload
router.post('/invoice/:req_id', async (req, res) => {
    try {
        console.log("Processing invoice text:" );

        const { req_id } = req.params;
        const { invoice } = req.body; // This is where we get the text input from the request body

        console.log("Invoice data: ", req.body);

        if (!invoice) {
            return res.status(400).send('No invoice data provided');
        }

        // Generate the file signature (if necessary) for the text data
        const fileSignature = await rsa.generateSignature("s", invoice); 
        console.log("Invoice data signed as: ", fileSignature);

        // SQL query to update the invoice in the database
        const sql = `
            UPDATE requests 
            SET invoice = ?, inv_rsa = ?
            WHERE req_id = ?`;
        const values = [invoice, fileSignature, Number(req_id)];

        // Execute the database query
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send("Error saving invoice");
            }
            res.send('Invoice submitted successfully');
            console.log("Invoice saved to database");
        });
    } catch (err) {
        console.error("Error during invoice processing:", err);
        res.status(500).send("Internal server error");
    }
});

router.get('/receipt/:req_id', async (req, res) => {
    const {req_id} = req.params


    sql = `UPDATE requests SET pay_receipt = 1 WHERE req_id = ?`
    db.query(sql, req_id)

    res.send("receipt sent")
})



// api/upload/verify
// Backend (Express)
router.get('/verify', async (req, res) => {
    const { data, signature, pubKey } = req.query;
    console.log("data", data)
    console.log("signature", signature)
    console.log("pubkey", pubKey)


    if (!data || !signature || !pubKey) {
        return res.status(400).send('Missing required parameters');
    }

    try {
        const isVerified = await rsa.generateSignature("v", data, signature, pubKey); // Assuming you have a function for this
        console.log(isVerified)
        res.send(isVerified); // Sending boolean response (true or false)
    } catch (err) {
        console.error("Error during signature verification:", err);
        res.status(500).send("Internal server error");
    }
});


module.exports = router