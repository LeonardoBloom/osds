const db = require('./db/db');
const CryptoJS = require('crypto-js');


async function encryption_db_handler() {
    try {

        const {prev_des, new_des} = await getLatestKey();

        if(!prev_des || !new_des) {
            console.error('No encryption key found in db');
            return;
        }
        console.log("old des key retrieved: ", prev_des);
        console.log("new des key retrieved: ", new_des);

        // get student data to update
        const students = await getStudents();
        if(students.length === 0) {
            console.log("No students to process");
            return;
        }

        // re encrypt and update each student data
        for (const student of students) {

            console.log("DEcrypting... ", student, " with OLD KEY: ", prev_des)
            const decryptedData = {
                fname: decrypt(student.fname, prev_des),
                lname: decrypt(student.lname, prev_des),
                email: decrypt(student.email, prev_des),
                pwd: decrypt(student.pwd, prev_des),
                dept: decrypt(student.dept, prev_des),
                gpa: decrypt(student.gpa, prev_des),
                cgpa: decrypt(student.cgpa, prev_des),
                transcript_info: student.transcript_info ? decrypt(student.transcript_info, prev_des) : null
            }
            console.log("decripted: ", decryptedData, " with OLD KEY: ", prev_des)

            console.log("ENcrypting... ", decryptedData, " with NEW KEY: ", new_des)
            const encryptedData = {
                fname: encrypt(decryptedData.fname, new_des),
                lname: encrypt(decryptedData.lname, new_des),
                email: encrypt(decryptedData.email, new_des),
                pwd: encrypt(decryptedData.pwd, new_des),
                dept: encrypt(decryptedData.dept, new_des),
                gpa: encrypt(decryptedData.gpa, new_des),
                cgpa: encrypt(decryptedData.cgpa, new_des),
                transcript_info: decryptedData.transcript_info ? encrypt(decryptedData.transcript_info, new_des) : null
            };
            console.log("Encrypted: ", encryptedData, " with NEW KEY: ", new_des)
            await updateStudent(student.stu_id, encryptedData)
        }
        console.log("all student records encrypted successfully");

        // get STAFF data to update
        const staff = await getStaff();
        if(staff.length === 0) {
            console.log("No staff to process");
            return;
        }

        // re encrypt and update each STAFF data
        for (const one of staff) {
            console.log("DEcrypting... ", one, " with OLD KEY: ", prev_des)
            const decryptedData = {
                fname: decrypt(one.fname, prev_des),
                lname: decrypt(one.lname, prev_des),
                email: decrypt(one.email, prev_des),
                pwd: decrypt(one.pwd, prev_des),
                dept: decrypt(one.dept, prev_des),
            }
            console.log("decripted: ", decryptedData, " with OLD KEY: ", prev_des)

            console.log("ENcrypting... ", decryptedData, " with NEW KEY: ", new_des)
            const encryptedData = {
                fname: encrypt(decryptedData.fname, new_des),
                lname: encrypt(decryptedData.lname, new_des),
                email: encrypt(decryptedData.email, new_des),
                pwd: encrypt(decryptedData.pwd, new_des),
                dept: encrypt(decryptedData.dept, new_des),
            };
            console.log("Encrypted: ", encryptedData, " with NEW KEY: ", new_des)
            await updateStaff(one.sf_id, encryptedData)
        }
        console.log("all staff records encrypted successfully");

    } catch (err) {
        console.error('Error during encryption and storage:', err)
    }
}

// get latest encryption key
function getLatestKey() {
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
    });
}

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
        // db.end()
    })
}

function encrypt(data, key) {
    return CryptoJS.DES.encrypt(data, key).toString();
}

function decrypt(data, key) {
    return CryptoJS.DES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
}

function getStudents() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM student', (err, results) => {
            if(err) {
                reject(err);
            } else {
                resolve(results)
            }
        })
    })
}
function getStaff() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM staff', (err, results) => {
            if(err) {
                reject(err);
            } else {
                resolve(results)
            }
        })
    })
}

function updateStudent(stu_id, data) {
    return new Promise((resolve, reject) => {
        db.query(`
            UPDATE student
            SET fname = ?, lname = ?, email = ?, pwd = ?, dept = ?,gpa = ?, cgpa = ?, transcript_info = ?
            WHERE stu_id = ?`,
        [
            data.fname,
            data.lname,
            data.email,
            data.pwd,
            data.dept,
            data.gpa,
            data.cgpa,
            data.transcript_info,
            stu_id,
        ],
    (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
    })
    })
}
function updateStaff(sf_id, data) {
    return new Promise((resolve, reject) => {
        db.query(`
            UPDATE staff
            SET fname = ?, lname = ?, email = ?, pwd = ?, dept = ?
            WHERE sf_id = ?`,
        [
            data.fname,
            data.lname,
            data.email,
            data.pwd,
            data.dept,
            sf_id,
        ],
    (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
    })
    })
}

module.exports = {encryption_db_handler, getDES_key };