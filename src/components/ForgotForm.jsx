'use client' // client side rendering

import React, { useState } from 'react';
import { useRouter } from "next/navigation";

export default function ForgotForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [reset, setReset] = useState(false);

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault();
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if ( re.test(email) ) {
        setError("")
        setReset(true)

        //reset password somehow..
    }
    else {
      setError("Please verify e-mail address is correct")
      return;
    }
  }

  return (
    !reset ?
    <div className="flex justify-center items-center h-screen">
      <div className="card w-1/2 bg-base-100 shadow-xl">
        <h1 className="card-title text-xl font-bold text-gray-900 justify-center">What's your FDM email?</h1>
        <form className="card-body space-y-4" onSubmit={handleSubmit}>
          <label className="input input-bordered input-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d ="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
            <input
              type="text"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          {error && (
            <div className="text-sm font-medium text-error">{error}</div>
          )}
          <div className="card-actions">
            <button className="btn btn-primary w-full">Reset my password</button>
          </div>
        </form>
      </div>
    </div> :

    <div className="flex justify-center items-center h-screen">
      <div className="card w-1/2 bg-base-100 shadow-xl">
        <h1 className="card-title text-xl font-bold text-gray-900 justify-center">Thank you</h1>
        <div className="card-body">
          <div className="text-sm font-medium">
            If your FDM account is associated with this email address you will receive an email 
            to reset your password.
          </div>
        </div>
      </div>
    </div>
  );
}