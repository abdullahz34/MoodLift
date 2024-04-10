"use client"

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function CreateForm() {
    const [message, setMessage] = useState("")
    const [error, setError] = useState([])
    const [success, setSuccess] = useState(false)
    const[nameTog,setName]= useState(false)
    const { data: session, status } = useSession()


    const handleSubmit = async (e) => {
        e.preventDefault()

        console.log("message :", message)
        let username_ = "";
        console.log(nameTog);
        if (nameTog) {
          username_ = session.user.name;
        }
        const username = username_;
        const res = await fetch("api/feedback",{
          method: "POST",
          headers: {
            "Content-type":"application/json"
          },
          body: JSON.stringify({
            message,
            username          
          }),
        });
      
        
        const { msg, success } = await res.json();
        setError(msg);
        setSuccess(success)

        if (success) {
          console.log("message :", message)
          setMessage("");
        }
    };

    const handleFormChange= () =>{
      setName(!nameTog) 
  }

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
          <div className="pr-5">Include username</div>
          <div>
                    <input type="checkbox"
                        onChange={handleFormChange}
                        className="toggle toggle-success"/>
                    </div>

        </form>
      )
}

  


