import { useState } from 'react'
import { useSignup } from '../hooks/useSignup'
import Dropdown from '../components/Dropdown'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [type, setType] = useState('')
  const {signup, error, isLoading} = useSignup()

  const handleSubmit = async (e) => {
    //e.preventDefault()
    setType("employee")
    await signup(username, password, type)
  }

  return (
    <form className="signup">
      <h3>Sign up</h3>
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
      <Dropdown type={type} setType={setType}/>
      <button disabled={isLoading} onClick={(e) => handleSubmit()}>Sign up</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default Signup