import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState('');
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  const fetchUser = async () => {
    const response = await fetch(`/api/user/${username}`)
    const json = await response.json()

    if (response.ok) {
      setUser(json)
    }
    return json;
  }

  const handleSubmit = (event) => {
    const fetchedUserType='admin'
//    const fetchedUser = await fetchUser();
    navigate("/dashboard", {state: {userType: fetchedUserType}});
      
    //authentication
  }

  return (
    <>
      <div>
        Login
      </div>
      <h2>usertype: {userType}</h2>
      <form onSubmit={handleSubmit}>
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