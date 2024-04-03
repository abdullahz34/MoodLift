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

    if (!username || !password || !name || !type) {
      setError("All fields are necessary")
      return;
    }

    try {
      const resUserExists = await fetch("/api/userExists", {
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

      const res = await fetch('/api/signup', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username, 
          password,
          name, 
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className="w-4 h-4 opacity-70">
              <path fillRule="evenodd" d="M8.749,9.934c0,0.247-0.202,0.449-0.449,0.449H4.257c-0.247,0-0.449-0.202-0.449-0.449S4.01,9.484,4.257,9.484H8.3C8.547,9.484,8.749,9.687,8.749,9.934 M7.402,12.627H4.257c-0.247,0-0.449,0.202-0.449,0.449s0.202,0.449,0.449,0.449h3.145c0.247,0,0.449-0.202,0.449-0.449S7.648,12.627,7.402,12.627 M8.3,6.339H4.257c-0.247,0-0.449,0.202-0.449,0.449c0,0.247,0.202,0.449,0.449,0.449H8.3c0.247,0,0.449-0.202,0.449-0.449C8.749,6.541,8.547,6.339,8.3,6.339 M18.631,4.543v10.78c0,0.248-0.202,0.45-0.449,0.45H2.011c-0.247,0-0.449-0.202-0.449-0.45V4.543c0-0.247,0.202-0.449,0.449-0.449h16.17C18.429,4.094,18.631,4.296,18.631,4.543 M17.732,4.993H2.46v9.882h15.272V4.993z M16.371,13.078c0,0.247-0.202,0.449-0.449,0.449H9.646c-0.247,0-0.449-0.202-0.449-0.449c0-1.479,0.883-2.747,2.162-3.299c-0.434-0.418-0.714-1.008-0.714-1.642c0-1.197,0.997-2.246,2.133-2.246s2.134,1.049,2.134,2.246c0,0.634-0.28,1.224-0.714,1.642C15.475,10.331,16.371,11.6,16.371,13.078M11.542,8.137c0,0.622,0.539,1.348,1.235,1.348s1.235-0.726,1.235-1.348c0-0.622-0.539-1.348-1.235-1.348S11.542,7.515,11.542,8.137 M15.435,12.629c-0.214-1.273-1.323-2.246-2.657-2.246s-2.431,0.973-2.644,2.246H15.435z"></path>
            </svg>
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

          <label className="input input-bordered input-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d ="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
            <input
              type="name"
              placeholder="First name"
              onChange={(e) => setName(e.target.value)}
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
          <div className="card-actions">
            <button className="btn btn-primary w-full">Add user</button>
          </div>
        </form>
      </div>
    </div>

  );
}
