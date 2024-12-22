import React from 'react'
import { FaUserTie } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { MdError } from 'react-icons/md';
import { FaUserGraduate } from "react-icons/fa";
import ReactLoading from 'react-loading'
import { Router, Link } from 'react-router-dom';

const StaffList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                console.log("fetching students")
                const response = await fetch('http://localhost:5000/api/admin/staff', {
                    method: 'GET'
                });
                if (!response.ok) {
                    throw new Error('Network Response was not ok')
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        } 
        fetchStaff();
    }, []);

    if (loading) return <ReactLoading type={'spin'} height={20} width={20} />;
    if (error) return <p><MdError />Error Loading Staff</p>


  return (
    <>
    <div className='student-div'>
  <h1>Staff List:</h1>
  {data.map((student) => (
    <Link>
        <div className='student-one' key={student.stu_id}>
            <div className='student-icon'>
                <FaUserTie />
            </div>
            <div key={student.stu_id} className='student-item'>
                <p><strong>ID:</strong> {student.sf_id}</p>
                <p><strong>Name:</strong> {student.fname} {student.lname}</p>
                <p><strong>Department:</strong> {student.dept}</p>
            </div>
            
        </div>
    </Link>
  ))}
</div>

    </>
  )
}


export default StaffList