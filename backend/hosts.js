const db = require('./db/db')

async function getLatestKey() {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT key_value FROM des_key ORDER BY key_date DESC LIMIT 2',
            (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if( results.length < 2) {
                        resolve({prev_des: null, new_des: null});
                    } else {
                        resolve({prev_des: results[1].key_value, new_des: results[0].key_value});
                    }
                }
            }
        );
        db.end()
    });
}


const hello = async () => {


    console.log("running")
    
    let {prev_des, new_des } = await getLatestKey()
    console.log("key:", await new_des)
    
}

hello()