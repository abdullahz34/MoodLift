"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

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
          <span>Give Feedback</span>
          <textarea 
            required
            rows={10}
            cols={100}
            maxLength={300}
            className="text-[darkblue]"
            onChange={(e) => setMsg(e.target.value)}
            value={msg}
            />
            
        </label>
      <button
        className="btn-primary, text-[white]"
        disabled={isLoading}
      >
        Enter
      </button>
      </form>
    )
  }