"use client"
import Link from "next/link";
import { useSession } from "next-auth/react";


export default function SurveyNavbar() {

  const { data: session, status } = useSession()



  return (
    <nav className="bg-base-300 px-8 py-3">
      <div className="flex items-center">
        <Link className="btn btn-ghost text-lg text-bg-secondary font-bold mr-3" href={"/surveys"}>
          Dashboard
        </Link>
        {(session && (session.user.type === 'Admin' || session.user.type === 'Ambassador')) && (
          <Link className="btn btn-ghost text-lg text-bg-secondary font-bold mr-3" href="/addSurvey">
            Create Survey
          </Link>
        )}
        <Link className="btn btn-ghost text-lg text-bg-secondary font-bold mr-3" href={"/infographics"}>
          Infographics
        </Link>
      </div>
    </nav>
  );
}
