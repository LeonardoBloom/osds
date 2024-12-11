const NodeRSA = require('node-rsa');

let privateKey = ""
let publicKey = ""


function generateKeys() {

    const key = new NodeRSA({ b: 512 });
    privateKey = key.exportKey('private');
    publicKey = key.exportKey('public');

}

generateKeys()

// Data to sign
const data = "This is a secret message";

// Sign the data
const keyForSigning = new NodeRSA(privateKey);
const signature = keyForSigning.sign(data, 'base64');
console.log("Signature:", signature);

// Verify the signature
const keyForVerification = new NodeRSA(publicKey);
const isValid = keyForVerification.verify(data, signature, 'utf8', 'base64');
console.log("Is signature valid?", isValid);

