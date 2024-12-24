import React, { useState } from 'react';
import './AddStaff.css'
import globalURL from '../../../globalURL';

function StaffForm() {
  // Set initial state for form fields
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    pwd: '',
    dept: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation check (ensure all fields are filled out)
    if (
      !formData.fname ||
      !formData.lname ||
      !formData.email ||
      !formData.pwd ||
      !formData.dept
    ) {
      alert('Please fill in all fields.');
      return;
    }

    // Log form data (this could be an API call)
    console.log('Form Data Submitted:', JSON.stringify(formData));

    try {
        const response = await fetch(`http://${globalURL()}:5000/api/admin/staff/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
    
        if (response.ok) {
            alert("Added New Staff Successfully");
        } else {
            const errorMessage = await response.text(); // Get error message from server
            alert(`Failed to add staff: ${errorMessage}`);
        }
    } catch (error) {
        alert(`Error adding staff: ${error.message}`);
        console.error("Error adding staff:", error);
    }
    

    // Reset form
    // setFormData({
    //   fname: '',
    //   lname: '',
    //   email: '',
    //   pwd: '',
    //   dept: '',
    // });
  };

  return (
    <div className='form-container'>
      <h1 className='form-title'>Add Staff:</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fname">First Name:</label>
          <input
          className="input input-bordered w-full max-w-xs"
            placeholder='First Name'
            type="text"
            id="fname"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="lname">Last Name:</label>
          <input
          className="input input-bordered w-full max-w-xs"
            placeholder='Last Name'
            type="text"
            id="lname"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            className="input input-bordered w-full max-w-xs"
            placeholder='Email'
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
          className="input input-bordered w-full max-w-xs"
            placeholder='Password'
            type="password"
            id="password"
            name="pwd"
            value={formData.pwd}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="dept">Department:</label>
          <input
            className="input input-bordered w-full max-w-xs"
            placeholder='Department'
            type="text"
            id="dept"
            name="dept"
            value={formData.dept}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Staff</button>
      </form>
    </div>
  );
}

export default StaffForm;
