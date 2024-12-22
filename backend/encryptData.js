const CryptoJS = require('crypto-js');
const des = require('./des');



async function encryptData(data) {

    try {

        let cipher = des.encrypt(data)

        return cipher

    } catch (error) {

    }
}

function getLatestKey() {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT key_value FROM des_key ORDER BY key_date DESC LIMIT 1',
            (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if( results.length < 2) {
                        resolve({new_des: null});
                    } else {
                        resolve({new_des: results.key_value});
                    }
                }
            }
        );
    });
}

module.exports = encryptData