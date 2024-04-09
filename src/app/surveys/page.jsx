
import React from 'react';


import SurveyList from "../../components/SurveyList";

import { getServerSession } from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import SurveyListLite from '../../components/SurveyListLite';

export default async function Home() {
  const session = await getServerSession(authOptions);
//add a way to refresh auto here on server comp if possible
//not a requirement, optional for security
  
  if (session && (session.user.type === 'Admin' || session.user.type === 'Ambassador' || session.user.type === 'Superadmin')) {
    
    return <SurveyList />;
  } else if (session && session.user.type === 'Employee') {
    
    return <SurveyListLite />;
  }
  else if(!session) {
    return( <div className="flex items-center justify-center h-screen">
    <h1 className="text-2xl font-bold text-gray-800">
      You are not authorised to view surveys. Please log in first. 
    </h1>
  </div>);
  }
  
}

