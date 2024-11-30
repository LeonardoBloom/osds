import logo from './logo.svg';
import './App.css';
import Login from './components/login/Login.jsx'

import { Route, Routes} from 'react-router-dom';
import Register from './components/register/Register.jsx';


function App() {
  return (
    <>
<<<<<<< HEAD
        <Routes>
          
  
          <Route path='/' element={<Login />} />
          <Route path='/admin/register' element={<Register/>} />
          {/* <Route path='/register' element={<SignUp />} /> */}

        </Routes>
=======
      <Login
      name = "James"
      />
    
>>>>>>> 265de80ff7adce00116b3ef97edf9a74171db4d4
    </>
  );
}

export default App;
