'use client' // client side rendering
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from 'next/link'

const AdminDash = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignout = async (e) => {
    e.preventDefault()
    signOut()
  }

  return (
    <div className="flex justify-center space-x-8 items-center h-screen">
      <div className="flex justify-center items-center h-screen">
        <div className="card w-96 bg-base-100 shadow-xl">
          <h1 className="card-title text-xl font-bold text-gray-900 justify-center">Your details</h1>
          <div className="card-body space-y-4">
            <div>
              Username: <span className="font-bold">{session?.user?.username}</span>
            </div>
            <div>
              Type: <span className="font-bold">{session?.user?.type}</span>
            </div>
            <div className="card-actions">
              <button 
                onClick={handleSignout}
                className="btn btn-secondary w-full">Logout</button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <h1 className="card-title text-xl font-bold text-gray-900 justify-center">Manage Users</h1>
          <div className="card-body space-y-4">
            <div className="card-actions">
              <Link href="/manage-users" className="btn btn-secondary w-full">Go</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDash;