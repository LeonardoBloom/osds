import logo from './logo.svg';
import './App.css';
import Login from './components/login/Login.jsx'

import { Route, Routes} from 'react-router-dom';
import Register from './components/register/Register.jsx';


function App() {
  return (
    <>
        <Routes>
          
  
          <Route path='/' element={<Login />} />
          <Route path='/admin/register' element={<Register/>} />
          {/* <Route path='/register' element={<SignUp />} /> */}

        </Routes>
    </>
  );
}

export default App;
