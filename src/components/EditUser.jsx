"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditUser({id, username, name, type}) {
  const [newUsername, setUsername] = useState(username);
  const [newName, setName] = useState(name);
  const [newPassword, setPassword] = useState('');
  const [newType, setType] = useState(type);
  const [submitted, setSubmitted] = useState(false);

  const [isUNValid, setIsUNValid] = useState(true)
  const [isPWValid, setIsPWValid] = useState(true)
  const [error, setError] = useState('')

  const { data: session } = useSession();
  const router = useRouter();

  if (session?.user?.type!=="Admin" && session?.user?.type!=="Superadmin") router.replace("/");


  useEffect(() => {
    !newPassword && (setIsPWValid(true), setError(''))
    !newUsername && (setIsUNValid(true), setError(''))
  }, [newPassword, newUsername]);

  const validatePW = () => {
    let check = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    const isValid = newPassword.match(check) 
    if(!isValid) {
      setError("Password not secure enough")
    }
    else {
      setError("")
    }
    setIsPWValid(isValid)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUNValid(true)

    if (newPassword) {
      validatePW();
    }

    if (!isPWValid) {
      return;
    }

    try {
      const resUserExists = await fetch("/api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({username: newUsername}),
      })
      
      const {user} = await resUserExists.json();
      if (user) {
        setIsUNValid(false)
        setError("User already exists")
        return;
      }

      const res = await fetch(`/api/searchUser/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ newUsername, newName, newPassword, newType }),
      });

      if (!res.ok) {
        throw new Error("Failed to update user");
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false)
        router.replace("/manage-users/modify")
      }, 2000);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {submitted && (
        <div role="alert" className="alert alert-success fixed top-0 left-0 right-0 flex items-center justify-center mt-4 p-2 text-sm max-w-xs mx-auto z-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>User successfully updated!</span>
        </div>
      )}
      <div className="card w-96 bg-base-100 shadow-xl">
        <h1 className="card-title text-xl font-bold text-gray-900 justify-center">Edit user</h1>

        <form className="card-body space-y-4" id="SubmitForm" onSubmit={handleSubmit}>
          <label className={`input input-bordered ${isUNValid ? 'input-primary' : 'input-error' } flex items-center gap-2`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className="w-4 h-4 opacity-70">
              <path fillRule="evenodd" d="M8.749,9.934c0,0.247-0.202,0.449-0.449,0.449H4.257c-0.247,0-0.449-0.202-0.449-0.449S4.01,9.484,4.257,9.484H8.3C8.547,9.484,8.749,9.687,8.749,9.934 M7.402,12.627H4.257c-0.247,0-0.449,0.202-0.449,0.449s0.202,0.449,0.449,0.449h3.145c0.247,0,0.449-0.202,0.449-0.449S7.648,12.627,7.402,12.627 M8.3,6.339H4.257c-0.247,0-0.449,0.202-0.449,0.449c0,0.247,0.202,0.449,0.449,0.449H8.3c0.247,0,0.449-0.202,0.449-0.449C8.749,6.541,8.547,6.339,8.3,6.339 M18.631,4.543v10.78c0,0.248-0.202,0.45-0.449,0.45H2.011c-0.247,0-0.449-0.202-0.449-0.45V4.543c0-0.247,0.202-0.449,0.449-0.449h16.17C18.429,4.094,18.631,4.296,18.631,4.543 M17.732,4.993H2.46v9.882h15.272V4.993z M16.371,13.078c0,0.247-0.202,0.449-0.449,0.449H9.646c-0.247,0-0.449-0.202-0.449-0.449c0-1.479,0.883-2.747,2.162-3.299c-0.434-0.418-0.714-1.008-0.714-1.642c0-1.197,0.997-2.246,2.133-2.246s2.134,1.049,2.134,2.246c0,0.634-0.28,1.224-0.714,1.642C15.475,10.331,16.371,11.6,16.371,13.078M11.542,8.137c0,0.622,0.539,1.348,1.235,1.348s1.235-0.726,1.235-1.348c0-0.622-0.539-1.348-1.235-1.348S11.542,7.515,11.542,8.137 M15.435,12.629c-0.214-1.273-1.323-2.246-2.657-2.246s-2.431,0.973-2.644,2.246H15.435z"></path>
            </svg>
            <input
              type="username"
              placeholder={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className={`input input-bordered ${isPWValid ? 'input-primary' : 'input-error' } flex items-center gap-2`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
            <input
                type="password"
                placeholder="New password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePW();
                }}
            />
          </label>

          <label className="input input-bordered input-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d ="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
            <input
              type="name"
              placeholder={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Employee</span> 
              <input 
                type="radio" 
                name="newType" 
                className="radio checked:bg-secondary" 
                value="Employee"
                checked={newType==='Employee'}
                onChange={(e) => setType(e.target.value)}
              />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text">Ambassador</span> 
              <input 
                type="radio" 
                name="newType" 
                className="radio checked:bg-accent" 
                value="Ambassador"
                checked={newType==='Ambassador'}
                onChange={(e) => setType(e.target.value)} 
              />
            </label>
            {session?.user?.type==='Superadmin' &&
              <label className="label cursor-pointer">
                <span className="label-text">Admin</span> 
                <input 
                  type="radio" 
                  name="newType" 
                  className="radio checked:bg-success" 
                  value="Admin"
                  checked={newType==='Admin'}
                  onChange={(e) => setType(e.target.value)} 
                />
              </label>
            }
          </div>    
          {error && (
            <div className="flex items-center text-sm font-medium text-error">
              <span>{error}</span>
              {error==="Password not secure enough" &&
                <div className="tooltip tooltip-right tooltip-error ml-2" data-tip="Password must be at least 8 characters, and contain at least one uppercase letter, lowercase letter, number, and symbol">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                    </svg>
                  </span>
                </div>
              }
            </div>
          )}
          <div className="card-actions">
            <button className="btn btn-primary w-full">Update user</button>
          </div>
        </form>
      </div>
    </div>
  );
}