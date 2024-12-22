import logo from './logo.svg';
import './App.css';
import Login from './components/login/Login.jsx'

import { Route, Routes} from 'react-router-dom';
import Register from './components/register/Register.jsx';
import AdminHome from './pages/admin/home/AdminHome.jsx';
import StaffHome from './pages/staff/home/StaffHome.jsx';
import StudentHome from './pages/student/home/StudentHome.jsx';


function App() {
  return (
    <>
        <Routes>
          
  
          <Route path='/login' element={<Login />} />
          {/* <Route path='/admin/register' element={<Register/>} /> */}
          <Route path='/admin' element={<AdminHome />} />
          <Route path='/staff' element={<StaffHome />} />
          <Route path='/student' element={<StudentHome />} />
          {/* <Route path='/register' element={<SignUp />} /> */}

        </Routes>
    </>
  );
}

export default App;
