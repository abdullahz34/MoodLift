import BackButton from "@/components/backButton";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from 'next/link'

export default async function ManageUsers() {
  const session = await getServerSession(authOptions);

  if (session?.user?.type!=="Admin" && session?.user?.type!=="Superadmin") redirect("/");

  return (
    <>
      <BackButton route="/" label="dashboard" />
      <div className="flex justify-center space-x-8 items-center h-screen">
        <div className="flex justify-center items-center">
          <div className="card w-96 bg-base-100 shadow-xl">
            <h1 className="card-title text-xl font-bold text-gray-900 justify-center">Add new user</h1>
            <div className="card-body space-y-4">
              <div className="card-actions">
                <Link href="/manage-users/signup" className="btn btn-secondary w-full">Go</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="card w-96 bg-base-100 shadow-xl">
            <h1 className="card-title text-xl font-bold text-gray-900 justify-center">Modify account</h1>
            <div className="card-body space-y-4">
              <div className="card-actions">
                <Link href="/manage-users/modify" className="btn btn-secondary w-full">Go</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}