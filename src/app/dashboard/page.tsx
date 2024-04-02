import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import AdminDash from "../../components/adminDash"
import AmbassadorDash from "../../components/AmbassadorDash"
import EmployeeDash from "../../components/EmployeeDash"

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  var hour = new Date().getHours();
  const time = ("Good " + (hour<12 && "Morning" || hour<18 && "Afternoon" || "Evening"))

  if (!session) redirect("/login");

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl font-bold text-gray-900 w-3/4 mt-8">{time} {session?.user?.name}!</h1>
      {session?.user?.type==="Admin" &&
        <AdminDash />
      }
      {session?.user?.type==="Ambassador" &&
        <AmbassadorDash />
      }
      {session?.user?.type==="Employee" &&
        <EmployeeDash />
      }
    </div>
  )
}