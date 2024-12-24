import React, { useState, useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import axios from '../../api/axios';
import { useNavigate } from "react-router-dom";

import './Login.css';
import { MdOutlineEnhancedEncryption } from "react-icons/md";

const LOGIN_URL = '/auth/login';

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
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

  const handleRoleChange = (event) => {
    const role = event.target.value;
    setSelectedRole(role);
    setFormData((prevData) => ({
      ...prevData,
      role: role,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.des_key || !formData.email || !formData.pwd || !formData.role) {
      alert("Please fill in all fields, including the role.");
      return;
    }

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify(formData),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Response data:", response?.data);

      // Navigate based on the selected role
      if (formData.role === "sysadmin") {
        navigate("/admin", { state: { id: formData.email } });
      } else if (formData.role === "staff") {
        navigate("/staff", { state: { sf_id: formData.email } });
      } else if (formData.role === "student") {
        navigate("/student", { state: { stu_id: formData.email } });
      } else {
        alert("Invalid role.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert(`Login failed: ${err.message}`);
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
            value={formData.des_key}
            onChange={handleChange}
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <input
            type="password"
            className="grow"
            placeholder="Password"
            name="pwd"
            value={formData.pwd}
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
