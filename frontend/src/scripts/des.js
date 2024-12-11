import CryptoJS from 'crypto-js'
import { useState } from 'react';


const Des_scr = () => {

    let mode = "e"
    const [JSONdata, setJSONData] = useState(null)

    // FETCH periodic Key from db
    const fetchKey = async () => {
        // subject to change
        const key = "12345678"
        return key
    }

    // fetch json info from db
    async function fetchJSONdata() {
        const dataSource = "./files/student.json"
        
        const res = await fetch(dataSource)

        const data = await res.json()
        console.log("inside: ", JSON.stringify())
        setJSONData(data)
        return 0
    }
    
    if (JSONdata == null) {
        fetchJSONdata()
    }
    // console.log("data after: ", JSONdata)

    const key = CryptoJS.enc.Utf8.parse(fetchKey());

    if (mode == "e") {

        console.log("encrypting: ", JSONdata)

        var encrypted = CryptoJS.DES.encrypt(JSON.stringify(JSONdata), key, { 
            mode: CryptoJS.mode.ECB, // ECB mode (default) or CBC
            padding: CryptoJS.pad.Pkcs7 // Padding mode (default)
        });
        console.log("ciphertext:", encrypted.toString())

    }
    else if (mode == "d") {
        var decrypted = CryptoJS.DES.decrypt(encrypted, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        
        console.log("decrypted: ", decrypted.toString(CryptoJS.enc.Utf8))
        console.log("decrypted --> json: ", JSON.parse(decrypted.toString(CryptoJS.enc.Utf8)))
    }
}

export default Des_scr