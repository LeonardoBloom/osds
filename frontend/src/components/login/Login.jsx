import React, { useState, useRef, useEffect, useContext} from 'react'
import AuthContext from '../../context/AuthProvider';
import axios from '../../api/axios';
import { Form, useNavigate } from "react-router-dom"; // Import useNavigate

import './Login.css';
import Des_scr from '../../scripts/des';
import { MdOutlineEnhancedEncryption } from "react-icons/md";
import { useSignIn } from 'react-auth-kit'

const LOGIN_URL = '/auth/login'
const Login = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { setAuth } = useContext(AuthContext);
  const [selectedRole, setSelectedRole] = useState("");
  const [FormData, setFormData] = useState({
    des_key: "",
    email: "",
    pwd: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle radio button selection
  const handleRoleChange = (event) => {
    const role = event.target.value;
    setSelectedRole(role);
    setFormData((prevData) => ({
      ...prevData,
      role: role,
    }));
    performAction(role);
  };

  // Perform some action based on the selected role
  const performAction = (role) => {
    console.log(`Selected role is: ${role}`);
    // Add additional actions if needed
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!FormData.des_key || !FormData.email || !FormData.pwd || !FormData.role) {
      alert("Please fill in all fields, including the role.");
      return;
    }

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify(FormData),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Response data:", JSON.stringify(response?.data));
      // alert("Login successful!");
      if (FormData.role == "sysadmin") {
        navigate("/admin", {state: {id: FormData.email}})
      } else if (FormData.role == "staff") {
        navigate("/staff", {state: {sf_id: FormData.email} })
      } else if (FormData.role == "student") {
        navigate("/student", {state: {stu_id: FormData.email}})
      }


    } catch (err) {
      // console.error("Login failed:", err);
      alert("Login failed.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h1 style={{ textAlign: "center", fontSize: "30px" }}>OSDS LOGIN</h1>
        <div>
          <p>Login as:</p>
          <label>
            <input
              type="radio"
              name="role"
              value="sysadmin"
              checked={selectedRole === "sysadmin"}
              onChange={handleRoleChange}
            />
            Admin
          </label>
          <br />

          <label>
            <input
              type="radio"
              name="role"
              value="student"
              checked={selectedRole === "student"}
              onChange={handleRoleChange}
            />
            Student
          </label>
          <br />

          <label>
            <input
              type="radio"
              name="role"
              value="staff"
              checked={selectedRole === "staff"}
              onChange={handleRoleChange}
            />
            Staff
          </label>
        </div>
        <br />

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
