import React from 'react'
import Calendar from '../../components/Calendar/index'
// import TimePicker from '../../components/TimePicker/index'

const Appointment = () => {
  return (
    <main>
      <div><Calendar /></div>
      {/* <div className=' flex flex-col items-left'>
        <TimePicker /></div> */}
    </main>
  )
}

// flex h-screen flex-col items-center justify center
export default Appointment