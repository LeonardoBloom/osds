const db = require('./db/db')

async function getDES_key() {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT key_value FROM des_key ORDER BY key_date DESC LIMIT 1`,
        (err, results) => {
            if(err) {
                reject(err)
            } else {
                if (results.length < 1) {
                    resolve({key: null})
                } else {
                    resolve({key: results[0].key_value})
                }
            }
        })
        db.end()
    })
}

async function getKey() {
    try {
        const key = await getDES_key()
        console.log(key.key)

    } catch (error) {

    }
}

getKey()