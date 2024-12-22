import React, { useState } from 'react'
import './AdminHome.css';
import { FaUserShield } from 'react-icons/fa';
import StudentList from '../../../components/Lists/student/StudentList';
import StaffList from '../../../components/Lists/staff/StaffList';
import StaffForm from '../addStaff/AddStaff';
import StudentForm from '../addStudent/AddStudent';

const AdminHome = () => {

    const [isVisible, setIsVisible] = useState(true)
    const [addStaff, setAddStaff] = useState(false)
    const [addStudent, setAddStudent] = useState(false)
    

    function goToHome() {
        console.log("clicked admin Home")
        setIsVisible(true)
        
        setAddStaff(false)

        setAddStudent(false)
    } 
    function goToAddStaff() {
        // alert("hadd staff")
        console.log("clicked add Staff")
        setIsVisible(false)

        setAddStaff(true)
        
        setAddStudent(false)
    }
    function goToAddStudent() {
        // alert("Add student")
        console.log("clicked add Student")

        setAddStaff(false)

        setIsVisible(false)

        setAddStudent(true)
        
    }
    

  return (
    <>
    <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
            {/* Page content here */}
            WELCOME ADMIN !

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

            {/* ADD STAFF */}
            {addStaff ? <StaffForm /> : <></>}

            {/* ADD STUDENT */}
            {addStudent ? <StudentForm /> : <></>}
            
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
                <h1>ADMIN</h1>
            </div>
            <li onClick={goToHome}><a>Home Page</a></li>
            <li onClick={goToAddStaff}><a>ADD Staff</a></li>
            <li onClick={goToAddStudent}><a>ADD Student</a></li>
            </ul>
        </div>
    </div>

    </>
  )
}

export default AdminHome