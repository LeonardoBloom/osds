const fs = require('fs');
const CryptoJS = require('crypto-js');

// Read the file as binary data
const filePath = './osds/backend/crypto/message.txt';  // Replace with your file path
const newfilePath = './osds/backend/crypto/decrypted.txt';  // Replace with your file path
const encryptedFilePath = './osds/backend/crypto/encrypted.des';  // Path for the encrypted file
const key = 'SecretPass';  // Secret key for encryption
const options = {
    mode: CryptoJS.mode.CBC,  // Cipher Block Chaining mode
    padding: CryptoJS.pad.Pkcs7  // Padding scheme (default)
};


function encrypt(filePath, key, encryptedFilePath, options) {
    // Read the file content
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
    
        // Encrypt the file data (data is a buffer)
        const encrypted = CryptoJS.DES.encrypt(data.toString('utf8'), key, options).toString();
        console.log("Message: ", data.toString('utf8'))
        console.log("encrypted into: ", encrypted)
    
        // Save the encrypted data to a new file
        fs.writeFile(encryptedFilePath, encrypted, (err) => {
            if (err) {
                console.error('Error writing encrypted file:', err);
            } else {
                console.log('File encrypted and saved as:', encryptedFilePath);
            }
        });
    });
}    

function decrypt(encryptedFilePath, key, filePath, options ) {
    // Decrypt the encrypted file
    fs.readFile(encryptedFilePath, (err, encryptedData) => {
        if (err) {
            console.error('Error reading encrypted file:', err);
            return;
        }

        // Decrypt the file data (encryptedData is a buffer, so we convert it to a string)
        const decrypted = CryptoJS.DES.decrypt(encryptedData.toString(), key, options).toString(CryptoJS.enc.Utf8);
        console.log("Ciphertext: ", encryptedData.toString())
        console.log("decrypted into: ", decrypted)

        // Save the decrypted data to a new file
        fs.writeFile(filePath, decrypted, (err) => {
            if (err) {
                console.error('Error writing decrypted file:', err);
            } else {
                console.log('File decrypted and saved as: ', encryptedFilePath);
            }
        });
    });
}

// encrypt(filePath, key, encryptedFilePath, options)
decrypt(encryptedFilePath, key, newfilePath, options )
