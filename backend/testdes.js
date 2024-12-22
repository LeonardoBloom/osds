const des = require('./des');

let cipher = des.encrypt("Hey there")

console.log(cipher)

let message = des.decrypt(cipher)
console.log(message)