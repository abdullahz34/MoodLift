
import React from 'react';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SurveyList from "../../components/SurveyList";



export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  
  return <SurveyList />;

}