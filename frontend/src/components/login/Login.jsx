import React, { useState, useRef, useEffect, useContext} from 'react'
import AuthContext from '../../context/AuthProvider';
import axios from '../../api/axios';

import './Login.css';
import Des_scr from '../../scripts/des';
import { MdOutlineEnhancedEncryption } from "react-icons/md";
import { useSignIn } from 'react-auth-kit'

const LOGIN_URL = '/auth/login'
const Login = () => {

  const {setAuth} = useContext(AuthContext);
  const [FormData, setFormData] = useState({
    des_key: "",
    email: "",
    pwd: "",
  });

  // const signIn = useSignIn();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...FormData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!FormData.des_key || !FormData.email || !FormData.pwd) {
      alert("Please fill in all fields.");
      return;
    }

    try {

      const response = await axios.post(LOGIN_URL, JSON.stringify(FormData),
        {
          headers: {'Content-Type': 'application/json'},
          
        }
      );
      console.log(JSON.stringify(response?.data));
      // console.log(JSON.stringify(response));

      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;

      // setAuth ({des_key, user, pwd, roles, accessToken});
      // const response = await fetch("http://localhost:5000/api/auth/login", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(FormData),
      // });

      // if (!response.ok) {
      //   const data = await response.json();
      //   console.log("Response Data:", data);

      //   // signIn({
      //   //   token: data.token,
      //   //   expiresIn: 3600,
      //   //   tokenType: "Bearer",
      //   //   authState: { des_key: FormData.des_key, email: FormData.email },
      //   // });

      //   alert("Login successful!");
        
      // } else {
      //   const errorText = await response.text();
      //   alert(`Login failed: ${errorText}`);
      // }

      // alert("Login successful!");
    } catch (err) {
      // if (!err?.response) {
      //   setErrMsg('No Server Response');
      // } else if (err.response?.status === 400) {
      //   setErrMsg('Missing Username, Passoword, or DES KEY')
      // } else if (err.response?.status === 401) {
      //   setErrMsg('Unauthorized')
      // } else {
      //   setErrMsg('Login Failed')
      // }
      // errRef.current.focus()
    }
  };

  return (
    <div className="login-container">
      
      <form onSubmit={handleLogin} className="login-form">
        <h1 
          style ={{textAlign: "center", 
                  fontSize: "30px"}}>
            OSDS LOGIN</h1>
        <label className="input input-bordered flex items-center gap-2">
          <MdOutlineEnhancedEncryption />
          <input
            type="text"
            className="grow"
            placeholder="DES Key"
            name="des_key"
            value={FormData.des_key}
            onChange={handleChange}
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Email"
            name="email"
            value={FormData.email}
            onChange={handleChange}
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <input
            type="password"
            className="grow"
            placeholder="Password"
            name="pwd"
            value={FormData.pwd}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="btn btn-wide" style={{ width: "100%" }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
