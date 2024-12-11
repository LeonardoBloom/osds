async function getStudent(id) {
    try {
        const response = await fetch(`http://localhost:5000/api/staff/students/${id}`, 
            {
                method: "GET"
            })
        
        const result = await response.json()
        if (response.ok) {
            let data = JSON.stringify(result)
            console.log(data)
            console.log(JSON.parse(data))
        } else {
            console.error("error getting student ",result.error)
        }    
        // return JSON.stringify(result)
    } catch (error) {
        console.error('error getting student', error);
    }
}

getStudent(20910110)
