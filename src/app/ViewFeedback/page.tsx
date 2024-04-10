import DisplayEntries from "./GetFeedback";
import Navbar from "@/components/Navbar";
import React from 'react';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function getFeedback() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");
    return (
        <div>
            <div className="card w-200 bg-base-100 shadow-xl">
  <div className="card-body">
    <h2 className="card-title bg-neutral-content">Viewing feedback</h2>
      <text>
        <DisplayEntries/>
        </text>
    </div>
  </div>
        </div>

    )
}   


