import React from 'react'

import { getServerSession } from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

//Employee Imports
import RequestAmbassador from "@/components/RequestAmbassador/index"

//Admin Imports
import ViewAmbassadors from "@/components/ViewAmbassador/index"

import Calendar from '@/components/Calendar/index'
import BookedAppointments from '@/components/BookedAppointments/index'
import AmbassadorProfileDisplay from '@/components/AmbassadorProfileDisplay/index'
import AmbassadorProfileEdit from '@/components/AmbassadorProfileEdit/index'

// Employee components = RequestAmbassador, BookedAppointments
// Admin = ViewAmbassadors
// Ambassadors= BookedAppointments, Calendar, ProfilePageEdit, ProfilePageDisplay


export default async function Appointment() {

  const session = await getServerSession(authOptions);


  if (!session) {
    return (
      <main>
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-2xl font-bold text-gray-800">
            You are not authorised to view Appointments. Please log in first.
          </h1>
        </div>
      </main>
    )
  }

  if (session && (session.user.type === 'Ambassador')) {
    return (
      <main>
        <div className='flex flex-row px-20 pb-10 justify-center '>
          
          <div className='pr-20'>   <BookedAppointments/>   </div>

          <div>   <Calendar />    </div>

        </div>

        <div className='flex flex-row px-20 pb-10 justify-center '>
          <div className='pr-20'>   <AmbassadorProfileDisplay/>   </div>

          <div>   <AmbassadorProfileEdit/>  </div>

        </div>
      </main>
  )}else if (session && session.user.type === 'Employee') {
      return (
        <main>

          <div className='flex flex-row px-20 pb-10 justify-center '>
            <div className='pr-20'>   <BookedAppointments/>   </div>

            <div><RequestAmbassador/></div>

          </div>
        </main>
  )}
//admin
  else if (session && session.user.type === 'Admin') {
      return (
        <main>
          <div className='flex flex-row px-20 pb-10 justify-center '>
              <ViewAmbassadors/>
          </div>
        </main>
  )}
}
