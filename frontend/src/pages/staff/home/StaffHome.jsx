import React, { useEffect, useState } from 'react'
import './StaffHome.css';
import { FaUserShield } from 'react-icons/fa';
import StudentList from '../../../components/Lists/student/StudentList';
import StaffList from '../../../components/Lists/staff/StaffList';
import EditInfo from '../editInfo/EditInfo';
import Requests from '../requests/Requests';
import EditGrades from '../editGrades/EditGrades';
// import StaffForm from '../addStaff/AddStaff';
// import StudentForm from '../addStudent/AddStudent';

const StaffHome = () => {

    const [isVisible, setIsVisible] = useState(true)
    const [addStaff, setAddStaff] = useState(false)
    const [addStudent, setAddStudent] = useState(false)
    const [requests, setRequests] = useState(false)
    const [requestData, setRequestData] = useState(false)

    useEffect (() => {
        getRequests()
    }, [])
    

    function goToHome() {
        console.log("clicked admin Home")
        setIsVisible(true)
        
        setAddStaff(false)

        setAddStudent(false)

        setRequests(false)
    } 
    function goToEditStaff() {
        // alert("hadd staff")
        console.log("clicked edit staff")
        setIsVisible(false)

        setAddStaff(true)
        
        setAddStudent(false)

        setRequests(false)
    }
    function goToEditStudent() {
        // alert("Add student")
        console.log("clicked edit Student gpa")

        setAddStaff(false)

        setIsVisible(false)

        setAddStudent(true)

        setRequests(false)


        
    }
    function goToRequests() {
        console.log("requests")
        setAddStaff(false)

        setIsVisible(false)

        setAddStudent(false)

        setRequests(true)
    }

    const getRequests = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/staff/requests')
            if (!response.ok) {
                console.error("error getting requests ")
            }

            const data = await response.json()
            console.log("requests: ", data)
            setRequestData(data)
        } catch (error) {

        }
    }

    
    

  return (
    <>
    <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
            {/* Page content here */}
            WELCOME STAFF !

            {/* USER LISTS */}
            <div className={`user-lists`}
                    style= {{display: isVisible ? '' : 'none'}}>
                <div className='student-list'>
                    <StudentList />
                </div>
                <div className='staff-list'>
                    <StaffList />
                </div>
            </div>

            {/* edit STAFF */}
            {addStaff ? <EditInfo id={123130} /> : <></>}

            {/* edit STUDENT */}
            {addStudent ? <EditGrades /> : <></>}

            {/* Requests */}
            {requests ? <Requests requests={requestData} /> : <></>}
            
            <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
            Open drawer
            </label>
        </div>
        <div className="drawer-side">
            <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-78 p-4">
            {/* Sidebar content here */}
            <div className='admin-head'>
                <div className='admin-pfp'>
                    <FaUserShield /> 
                </div>
                <h1>STAFF</h1>
            </div>
            <li onClick={goToHome}><a>Home Page</a></li>
            <li onClick={goToEditStaff}><a>Edit Information</a></li>
            <li onClick={goToEditStudent}><a>Edit Student GPA/CGPA</a></li>
            <li onClick={goToRequests}><a>Document Requests</a></li>
            
            </ul>
        </div>
    </div>

    </>
  )
}

export default StaffHome