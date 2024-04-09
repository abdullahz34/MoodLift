"use client"

import { useState } from "react";

export default function CreateForm() {
    const [message, setMessage] = useState("")
    const [error, setError] = useState([])
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        console.log("message :", message)


        const res = await fetch("api/feedback",{
          method: "POST",
          headers: {
            "Content-type":"application/json"
          },
          body: JSON.stringify({
            message,
          }),
        });
        
        const { msg, success } = await res.json();
        setError(msg);
        setSuccess(success)

        if (success) {
          setMessage("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-1/2">
          <label>
            <textarea 
              required
              rows={10}
              cols={200}
              maxLength={300}
              className="text-[darkblue]"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              />
              
          </label>
          <div><br></br></div>
          <button className="btn btn-secondary">Submit</button>  
       
        </form>
      )
}

  


