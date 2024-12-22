const NodeRSA = require('node-rsa')

module.exports = {
    generateKeys: function () {
        let keys = []
        
        const key = new NodeRSA({ b: 512 }); // 512-bit key
        const publicKey = key.exportKey('public');
        console.log("generated public key...")
        keys.push(publicKey)

        // let pubkey = publicKey.slice(27, 156)

        const privateKey = key.exportKey('private');
        console.log("generated private key...")
        keys.push(privateKey)

        console.log(keys)

        return keys
    },

    generateSignature: async function (mode, data, signature = "", pubkey = null) {
        // Sign the data (as string)

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

                console.log("signing...")
                const keyForSigning = new NodeRSA(result[0].key_priv);
                const signature = keyForSigning.sign(data, 'base64');
                console.log("Signature:", signature);
                
                return signature
    
            } else if (mode == "v") {
                // Verify the signature

                let public_k = ""
                if (pubkey) {
                    public_k = pubkey
                } else {
                    public_k = result[0].key_pub
                }

                console.log("verifying signature...")
                const keyForVerification = new NodeRSA(public_k);
                const isValid = keyForVerification.verify(data, signature, 'utf8', 'base64');
                console.log("Is signature valid?", isValid);
    
                return isValid
            }
    
    
        } catch (error) {
            console.error('error signing', error);
        }

}}





