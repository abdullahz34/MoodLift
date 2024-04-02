'use client' // client side rendering
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const SideBar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <div className="flex justify-center items-center h-screen mr-20">
      <div className="card w-96 bg-base-100 shadow-xl">
        <h1 className="card-title text-xl font-bold text-gray-900 justify-center">Sidebar</h1>
      </div>
    </div>
  )
}

export default SideBar;