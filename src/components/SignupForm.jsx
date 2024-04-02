'use client' // client side rendering
import { useState } from 'react';
import { useRouter } from "next/navigation"

export default function SignupForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [error, setError] = useState('')

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !type || !name) {
      setError("All fields are necessary")
      return;
    }

    try {
      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({username}),
      })
      
      const {user} = await resUserExists.json();
      if (user) {
        setError("User already exists")
        return;
      }

      const res = await fetch('api/signup', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username, 
          name,
          password, 
          type
        })
      })
      if (res.ok) {
        const form = e.target;
        form.reset()
        router.push("/")
      }
      else {
        console.log("user sign up failed")
      }
    } catch (error) {
      console.log("error during sign up: ", error)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="card w-96 bg-base-100 shadow-xl">
        <h1 className="card-title text-xl font-bold text-gray-900 justify-center">Add new user</h1>

        <form className="card-body space-y-4" id="SubmitForm" onSubmit={handleSubmit}>

        <label className="input input-bordered input-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d ="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
            <input
              type="name"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="input input-bordered input-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d ="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
            <input
              type="username"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className="input input-bordered input-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Employee</span> 
              <input 
                type="radio" 
                name="type" 
                className="radio checked:bg-secondary" 
                value="Employee"
                checked={type==='Employee'}
                onChange={(e) => setType(e.target.value)}
              />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text">Ambassador</span> 
              <input 
                type="radio" 
                name="type" 
                className="radio checked:bg-accent" 
                value="Ambassador"
                checked={type==='Ambassador'}
                onChange={(e) => setType(e.target.value)} 
              />
            </label>
          </div>    

          {error && (
            <div className="text-sm font-medium text-error">{error}</div>
          )}
          
          <div>
            <a href="#" className="text-sm font-medium text-primary hover:underline">Forgot password?</a>
          </div>
          <div className="card-actions">
            <button className="btn btn-primary w-full">Add user</button>
          </div>
        </form>
      </div>
    </div>

  );
}
