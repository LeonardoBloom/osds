const NodeRSA = require('node-rsa')
const key = new NodeRSA({ b: 512 }); // 512-bit key

module.exports = {
    generateKeys: function () {
        let keys = []
    
        const publicKey = key.exportKey('public');
        console.log(publicKey)
        keys.push(publicKey)

        // let pubkey = publicKey.slice(27, 156)

        const privateKey = key.exportKey('private');
        console.log(privateKey)
        keys.push(privateKey)

        console.log(keys)
        // let privkey = privateKey.split('\n').join('')
        // console.log("\n",privkey, "\n")
        // privkey = privkey.replace('/\n/g','')
        // console.log("\n",privkey, "\n")
        // privkey = privateKey.slice(32, 463)
        // console.log("\n",privkey, "\n")

        return keys
    },

    generateSignature: async function (mode, data, signature = "") {
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

}}





