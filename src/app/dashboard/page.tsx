import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import AdminDash from "../../components/adminDash";
import AmbassadorDash from "../../components/AmbassadorDash";
import EmployeeDash from "../../components/EmployeeDash";
import SideBar from "../../components/SideBar";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  var hour = new Date().getHours();
  const time = ("Good " + (hour<12 && "Morning" || hour<18 && "Afternoon" || "Evening"))

  if (!session) redirect("/login");

  return (
    <>
    <div className="flex flex-col">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold text-gray-900 mt-8 ml-20">{time} {session?.user?.name}!</h1>
        <h2 className="text-gray-900 mt-8 mr-20">Signed in as: <span className="font-bold">{session?.user?.type} : {session?.user?.username}</span></h2>
      </div>
      <div className="flex w-full">
        <SideBar />
        <div className="divider divider-horizontal mt-20 mb-20"></div>
        <div className="flex flex-col items-center">
          {(session?.user?.type==="Admin" || session?.user?.type==="Superadmin")&&
            <AdminDash />
          }
          {session?.user?.type==="Ambassador" &&
            <AmbassadorDash />
          }
          {session?.user?.type==="Employee" &&
            <EmployeeDash />
          }
        </div>
      </div>
    </div>
    </>
  )
}