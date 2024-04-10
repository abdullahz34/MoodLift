'use client' // client side rendering
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Goals from "./Goals";
import Link from 'next/link'

const SideBar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <>
      
        {(session?.user?.type==="Employee" || session?.user?.type==="Ambassador") &&
          <div className="flex justify-center items-center p-5 ml-5">
            <Goals />
          </div>
        }

        {(session?.user?.type==="Admin" || session?.user?.type==="Superadmin") &&
          <div className="flex justify-center items-center p-20">
            <div className="space-y-10">
              <div className="card w-96 bg-base-100 shadow-xl">
                <h1 className="card-title text-xl font-bold text-gray-900 justify-center">Manage Users</h1>
                <div className="card-body space-y-4">
                  <div className="card-actions">
                    <Link href="/manage-users" className="btn btn-secondary w-full">Go</Link>
                  </div>
                </div>
              </div>
              <div className="card w-96 bg-base-100 shadow-xl mt-8">
                <h1 className="card-title text-xl font-bold text-gray-900 justify-center">View Feedback</h1>
                <div className="card-body space-y-4">
                  <div className="card-actions">
                    <Link href="/ViewFeedback" className="btn btn-secondary w-full">Go</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
    </>
  )
}

export default SideBar;