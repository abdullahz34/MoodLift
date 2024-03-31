'use client' // client side rendering
import { signOut } from "next-auth/react";

function Dashboard() {

  const handleClick = async (e) => {
    e.preventDefault()
    signOut()
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="card w-96 bg-base-100 shadow-xl">
        <h1 className="card-title text-xl font-bold text-gray-900 justify-center">User details</h1>
        <div className="card-body space-y-4">
          <div>
            Username: <span className="font-bold">waow</span>
          </div>
          <div>
            Type: <span className="font-bold">crazzyyy</span>
          </div>
          <div className="card-actions">
            <button 
              onClick={handleClick}
              className="btn btn-secondary w-full">Logout</button>
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default Dashboard;