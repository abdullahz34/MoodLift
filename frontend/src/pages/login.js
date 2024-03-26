import React, { useState } from 'react';
import { useLogin } from '../hooks/useLogin'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [type, setType] = useState('');
  const {login, error, isLoading} = useLogin()

//  const fetchUser = async () => {
//    const response = await fetch(`/api/user/${username}`)
//    const json = await response.json()

//    if (response.ok) {
//      setUser(json)
//    }
//    return json;
//  }

//  const handleSubmit = (event) => {
//    const fetchedUserType='admin'
//    const fetchedUser = await fetchUser();
//    navigate("/dashboard", {state: {userType: fetchedUserType}});
      
    //authentication
//  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    await login(username, password)
  }

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>Log in</h3>

      <label>Username:</label>
      <input
        type="username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />

      <label>Password:</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <button disabled={isLoading}>Log in</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

export default Login;