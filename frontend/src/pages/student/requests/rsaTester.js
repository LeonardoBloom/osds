async function getpub() {

    const response = await fetch('http://localhost:5000/api/keys/rsa/pubkey')
    const data = await response.json()
    
    console.log(data)
}

getpub()
