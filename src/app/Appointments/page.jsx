import React from 'react'
import Calendar from '../../components/Calendar/index'
import BookedAppointments from '@/components/BookedAppointments/index'
import AmbassadorProfileDisplay from '@/components/AmbassadorProfileDisplay/index'
import AmbassadorProfileEdit from '@/components/AmbassadorProfileEdit/index'
// import TimePicker from '../../components/TimePicker/index'

const Appointment = () => {
  return (
    <main>
      <div className='flex flex-row px-20 pb-10 justify-center '>
        <div className='pr-20'><BookedAppointments/></div>
        <div><Calendar /></div>
      </div>
      <div className='flex flex-row px-20 pb-10 justify-center '>
        <div className='pr-20'>
          <AmbassadorProfileDisplay/>
        </div>
        <div>
          <AmbassadorProfileEdit/>
        </div>
      </div>
      {/* <div className=' flex flex-col items-left'>
        <TimePicker /></div> */}
    </main>
  )
}

// flex h-screen flex-col items-center justify center
export default Appointment