const fs = require('fs');
const CryptoJS = require('crypto-js');
const db = require('./db/db')
const des_handler = require('./encryption_db_handler')

// Read the file as binary data
const filePath = './backend/crypto/message.txt';  // Replace with your file path
const newfilePath = './backend/crypto/decrypted.txt';  // Replace with your file path
const encryptedFilePath = './backend/crypto/encrypted.des';  // Path for the encrypted file



// const key = 'SecretPass';  // Secret key for encryption
const options = {
    mode: CryptoJS.mode.CBC,  // Cipher Block Chaining mode
    padding: CryptoJS.pad.Pkcs7  // Padding scheme (default)
};


function generate_des_key () {

    const Newkey = CryptoJS.lib.WordArray.random(8);

    return key

}

const get_des_key = async () => {
    return await des_handler.getDES_key()
}


async function encrypt(data) {

    console.log("ENcrypting DATA...", data)

        const key = await get_des_key()

        
    
        // Encrypt the file data (data is a buffer)
        const encrypted = CryptoJS.DES.encrypt(data.toString('utf8'), key.key, options).toString();
        console.log("Message: ", data.toString('utf8'))
        console.log("encrypted into: ", encrypted)
    
        return await encrypted
    } 

async function decrypt(encryptedData) {

    console.log("DEcrypting DATA...")

        const key = await get_des_key()
    

        // Decrypt the file data (encryptedData is a buffer, so we convert it to a string)
        const decrypted = CryptoJS.DES.decrypt(encryptedData, key.key, options).toString(CryptoJS.enc.Utf8);
        console.log("Ciphertext: ", encryptedData)
        console.log("decrypted into: ", decrypted)

        return decrypted
    }

// encrypt(filePath, key, encryptedFilePath, options)
// decrypt(encryptedFilePath, key, newfilePath, options )

module.exports = { encrypt, decrypt, generate_des_key}