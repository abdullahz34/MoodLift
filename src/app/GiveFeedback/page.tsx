"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";



export default function GiveFeedback() {

    const [message, setMessage] = useState("")
    const [error, setError] = useState([])

    const handleSubmit = async () => {
      console.log("message :", message)
      const res = await fetch('api\feedback',{
        method: "POST",
        headers: {
          "Content-type":"application/json"
        },
        body: JSON.stringify({
          message
        })
      });
      
      const { msg } = await res.json();
      setError(msg);
    };
    

    

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
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            />
            
        </label>
      <button
        className="btn-primary, text-[white]"
      >
        Enter
      </button>
      </form>
    )
  }