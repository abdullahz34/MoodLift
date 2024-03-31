'use client' // client side rendering
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminDash from "../../components/adminDash"
import AmbassadorDash from "../../components/AmbassadorDash"
import EmployeeDash from "../../components/EmployeeDash"

function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status==="loading") return null

  if(status!=="loading" && !session) return router.replace("login")

  return (
    <>
      {session?.user?.type==="Admin" &&
        <AdminDash />
      }
      {session?.user?.type==="Ambassador" &&
        <AmbassadorDash />
      }
      {session?.user?.type==="Employee" &&
        <EmployeeDash />
      }
    </>
  )
}

export default Dashboard;