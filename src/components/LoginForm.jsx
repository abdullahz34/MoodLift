'use client' // client side rendering

import React, { useState, useEffect } from 'react';
//import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

//  const { data: session, status } = useSession();
  const router = useRouter()

  useEffect(() => {
    validateLogin();
  }, [username, password]);

  const validateLogin = () => {
    if(password.length<8) {
      setError("Password must be at least 8 characters.")
    }
    
    if(!username || !password) {
      setError("All fields are required")
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res && res.error) {
        setError("Invalid credentials")
        return;
      }
      
      router.replace("dashboard")
    } catch (error) {
       console.log(error)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="card w-96 bg-base-100 shadow-xl">
        <h1 className="card-title text-xl font-bold text-gray-900 justify-center">Log in</h1>

        <form className="card-body space-y-4" onSubmit={handleSubmit}>
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
          {error && (
            <div className="text-sm font-medium text-error">{error}</div>
          )}
          <div>
            <a href="/login/forgot-password" className="text-sm font-medium text-primary hover:underline">Forgot password?</a>
          </div>
          <div className="card-actions">
            <button className="btn btn-primary w-full">Log in</button>
          </div>
        </form>
      </div>
    </div>

  );
}