
import React from 'react';

import SurveyList from "../../components/SurveyList";

import { getServerSession } from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import SurveyListLite from '../../components/SurveyListLite';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session && session.user.type === 'Employee') {
    return <SurveyListLite />;
  } else {
    return <SurveyList />;
  }
}