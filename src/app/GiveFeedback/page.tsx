"use client"

import { useState } from "react";
import { useRouter } from "next/router";

export default function GiveFeedback() {

    const [msg, setMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
  

    const handleSubmit = async () => {
      
      setIsLoading(true)
      const feedback = {
        msg
      }

      const res = await fetch("http://localhost:3000/GiveFeedback",{
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify(feedback)
      })

      if (res.status === 201) {
        router.push('/GiveFeedback')
      }

    }

    

    return (
      <form onSubmit={handleSubmit} className="w-1/2">
        <label>
          <span>Message</span>
          <input 
            required
            type="text"
            onChange={(e) => setMsg(e.target.value)}
            value={msg}
            />
        </label>
      <button
        className="btn-primary"
        disabled={isLoading}
      >
      </button>
      </form>
    )
  }