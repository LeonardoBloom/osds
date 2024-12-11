
const NodeRSA = require('node-rsa');

async function genSign(mode, data, signature = "") {
    // Sign the data

    try {
        const response = await fetch('http://localhost:5000/api/keys/rsa/getkeys',
            {
                method: 'GET'
            }
        )

        const result = await response.json();
        if (response.ok) {
            console.log(result)
        } else {
            console.error("error getting keys ",result.error)
        }    

        if (mode == "s") {
            const keyForSigning = new NodeRSA(result[0].key_priv);
            const signature = keyForSigning.sign(data, 'base64');
            console.log("Signature:", signature);
            
            return signature

        } else if (mode == "v") {
            // Verify the signature
            const keyForVerification = new NodeRSA(result[0].key_pub);
            const isValid = keyForVerification.verify(data, signature, 'utf8', 'base64');
            console.log("Is signature valid?", isValid);

            return isValid
        }


    } catch (error) {
        console.error('error signing', error);
    }
}

signature = "C3bnQauGzMsMBN6Iq9cTsRNxYv+5f/S5ozDPM+CiChSSS0Sor0oqRLiqNhRohTCVNH6ikq/kpLRbpXmNJ4ED+Q=="

genSign("v", "hello", signature)
