'use client' // client side rendering
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status==="loading") return null

  if(status!=="loading" && !session) return router.replace("login")

  const handleClick = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    signOut()
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="card w-96 bg-base-100 shadow-xl">
        <h1 className="card-title text-xl font-bold text-gray-900 justify-center">User details</h1>
        <div className="card-body space-y-4">
          <div>
            Username: <span className="font-bold">{session?.user?.username}</span>
          </div>
          <div>
            Type: <span className="font-bold">{session?.user?.type}</span>
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