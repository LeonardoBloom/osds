import React, { useState } from 'react'
import './StudentHome.css';
import { FaUserShield } from 'react-icons/fa';
import StudentRequests from '../requests/StudentRequests';
import ViewRequests from '../requests/ViewRequests';
// import { useNavigate } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
// import StudentList from '../../../components/Lists/student/StudentList';
// import StaffList from '../../../components/Lists/staff/StaffList';
// import StaffForm from '../addStaff/AddStaff';
// import StudentForm from '../addStudent/AddStudent';

const StudentHome = () => {
    const navigate = useNavigate()

    const [isVisible, setIsVisible] = useState(true)
    const [makeRequest, setMakeRequest] = useState(false)
    const [view, setView] = useState(false)
    const [send, setSend] = useState(false)

    const stu_id = location.state?.stu_id
    

    function goToHome() {
        console.log("clicked Home")
        setIsVisible(true)
        
        setMakeRequest(false)

        setView(false)

        setSend(false)
    } 
    function goToRequests() {
        // alert("hadd staff")
        console.log("clicked send requests")
        setIsVisible(false)
        
        setMakeRequest(true)

        setView(false)

        setSend(false)
    }
    function goToView() {
        // alert("Add student")
        console.log("clicked view requests")

        setIsVisible(false)
        
        setMakeRequest(false)

        setView(true)

        setSend(false)
    }

    function goToSend() {
        console.log("send invoice")

        setIsVisible(false)
        
        setMakeRequest(false)

        setView(false)

        setSend(true)
    }
    

  return (
    <>
    <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
            {/* Page content here */}
            WELCOME STUDENT !

            {/* Home */}
            {isVisible ? <>Home</> : (<></>)}
            
            {/* ADD STAFF */}
            {makeRequest ? <StudentRequests stu_id={stu_id} /> : (<></>)}

            {/* ADD STUDENT */}
            {view ? <ViewRequests stu_id={stu_id}/> : (<></>)}

            {send ? <>send invoice</> : (<></>)}
           
            
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
                <h1>Student</h1>
            </div>
            <li onClick={goToHome}><a>Home</a></li>
            <li onClick={goToRequests}><a>Request Document</a></li>
            <li onClick={goToView}><a>View Requests</a></li>
            {/* <li onClick={goToSend}><a>Send Invoice</a></li> */}
            <br></br>
            <br></br>
            <br></br>
            <li onClick={() => navigate('/')}><a>LOG OUT</a></li>
            </ul>

            
        </div>
    </div>

    </>
  )
}

export default StudentHome