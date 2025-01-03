import React, { useState, useEffect } from 'react';
import globalURL from '../../../globalURL';

const EditGrades = ({id}) => {
  const [userData, setUserData] = useState({
    email: '',
    fname: '',
    lname: '',
    gpa: '',
    cgpa: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);

  
  // Fetch the data from the API when the component mounts
  useEffect(() => {
      // Replace with your actual API endpoint
  
    fetch(`http://${globalURL()}:5000/api/staff/students/${id}`) 
      .then(response => response.json())
      .then(data => {
        setUserData(data[0]); // Set the retrieved data into state
        console.log(data[0])
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  // Handle form submit (update user info)
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("sending..", userData)
    // Call API to update user data
    let id = 123
    try {
      const response = await fetch(`http://localhost:5000/api/staff/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        setIsEditing(false); // Disable editing after save
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </label>
        <br />
        <label>
          First Name:
          <input
            type="text"
            name="fname"
            value={userData.fname}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </label>
        <br />
        <label>
          Last Name:
          <input
            type="text"
            name="lname"
            value={userData.lname}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </label>        
        <br />
        <label>
          GPA:
          <input
            type="text"
            name="gpa"
            value={userData.gpa}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </label>        
        <br />
        <label>
          CGPA:
          <input
            type="text"
            name="cgpa"
            value={userData.cgpa}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </label>        
        <br />
        
        <div>
          <button type="button" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button type="submit" disabled={!isEditing}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditGrades;