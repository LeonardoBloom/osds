import React, { useEffect, useState } from 'react'
import { MdError } from 'react-icons/md';
import { FaUserGraduate } from "react-icons/fa";
import ReactLoading from 'react-loading'
import { Router, Link } from 'react-router-dom';
import './StudentList.css'

const StudentList = ( {onStudentSelect }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [id, setId] = useState(null)

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                console.log("fetching students")
                const response = await fetch('http://localhost:5000/api/staff/students', {
                    method: 'GET'
                });
                if (!response.ok) {
                    throw new Error('Network Response was not ok')
                }
                const result = await response.json();
                setData(result);
                setId(result.stu_id);
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        } 
        fetchStudents();
    }, []);

    if (loading) return <ReactLoading type={'spin'} height={20} width={20} />;
    if (error) return <p><MdError />Error Loading Students</p>

    function clickedId(id) {
        // console.log(id)
        onStudentSelect(id)
    }

  return (
    <>
    <div className='student-div'>
  <h1>Student List:</h1>
  {data.map((student) => (
    <div  style={{cursor: "pointer"}} className='student-one' key={student.stu_id} onClick={() => clickedId(student.stu_id)}>
        <div className='student-icon'>
            <FaUserGraduate />
        </div>
        <div className='student-item'>
            <p><strong>ID:</strong> {student.stu_id}</p>
            <p><strong>Name:</strong> {student.fname} {student.lname}</p>
            <p><strong>Department:</strong> {student.dept}</p>
            <p><strong>CGPA:</strong> {student.cgpa}</p>
        </div>
    </div>
))}

</div>

    </>
  )
}

export default StudentList