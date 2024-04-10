// surveys/layout.js
import React from 'react';
import SurveyNavbar from "../../components/SurveyNavbar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../app/api/auth/[...nextauth]/route";

const SurveyLayout = async ({ children }) => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  return (
    <div>
      <SurveyNavbar />
      <header></header>
      <main>{children}</main>
      <footer></footer>
    </div>
  );
};

export default SurveyLayout;