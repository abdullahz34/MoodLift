import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('unknown');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    const fetchedUserType = 'admin';
    setUserType(fetchedUserType);
    //authentication
    
    navigate("/dashboard/"+fetchedUserType);
  }

  return (
    <>
      <div>
        Login
      </div>
      <form onSubmit={handleSubmit}>
        <h2>User Type: {userType}</h2>
        <label>Username:</label>
        <input
          value = {username}
          onChange = {(event) => setUsername(event.target.value)}
          placeholder = "Enter username"
        />
        <label>Password:</label>
        <input
          value = {password}
          onChange = {(event) => setPassword(event.target.value)}
          placeholder = "Enter password"
        />
        <button onClick={() => handleSubmit()}>Log in</button>
      </form>
    </>
  );
}

export default Login;