import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import AdminDash from "../../components/adminDash"
import AmbassadorDash from "../../components/AmbassadorDash"
import EmployeeDash from "../../components/EmployeeDash"

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

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