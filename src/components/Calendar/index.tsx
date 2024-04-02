'use client';
import { FC, useState } from "react"
import ReactCalendar from 'react-calendar'
import '../Calendar/CalendarStyle.css';
import {add,format} from 'date-fns';

interface indexProps{}

interface DateType{
    justDate:Date | null
    dateTIme:Date | null
}

const index: FC<indexProps> = ({}) => {
    // Time Selection
    const[date,setDate] = useState<DateType>({
        justDate: null,
        dateTIme: null,
    })

    console.log(date.dateTIme)
    // console.log(date.justDate)

    const getTimes = () => {
        
        if(!date.justDate) date.justDate= new Date()

        const {justDate} = date
        date.justDate.setHours(0)
        date.justDate.setMinutes(0)
        //date-fns used below
        const beginning = add(justDate, {hours: 9})
        const end = add(justDate, {hours: 17})
        const interval = 60 // minutes

        const times =[]

        for (let i = beginning; i<= end;i =add(i, {minutes:interval})){
            times.push(i)
        }
        return times
    }

    const times=getTimes()


    // AppointmentSelection= Calendar and RightSide     className="flex flex-row" 
    // Rightside= Time and AddButton                    className="flex flow-col"
    // Time= would display all possible times           className=""
    // AddButton= adds the date to the database         className= 

    // Date selection

    // return (
    // <div className="h-screen flex flex-col justify-center items-center">
    //     {date.justDate ? (
    //         <div className="flex gap-4">
    //             {times?.map((time,i) => (
    //                 <div key={`time-${i}`} className="rounded-sm bg-gray-100 p-2">
    //                     <button type='button' onClick={() => setDate ((prev) => ({... prev,dateTIme:time}))}>
    //                         {format(time,'kk:mm')}  {/* kk for military time */}
    //                     </button> 
    //                 </div>
    //             ))}
    //         </div>
    //     ):(
    //     <ReactCalendar  
    //         minDate={new Date()} 
    //         className='REACT-CALENDAR p-2' 
    //         view='month' 
    //         onClickDay={(date) => setDate ((prev) => ({...prev,justDate:date}))} 
    //     />
    //     )}
    // </div>
    // )

    return (
    <div className="flex flex-row p-4">
        {/* AppointmentSelection= Calendar and RightSide */}

        <ReactCalendar  
            minDate={new Date()} 
            className='REACT-CALENDAR p-2' 
            view='month' 
            onClickDay={(date) => setDate ((prev) => ({...prev,justDate:date}))} 
        />
        <div className="flex flex-col ">
            {/* Rightside= Time and AddButton */}

            <div className="grid grid-cols-3 gap-4 px-5 py-14">
                {/* Time= would display all possible times */}

                {times?.map((time,i) => (
                    <div key={`time-${i}`} className="rounded-lg bg-gray-100 p-5 ">
                        <button type='button' onClick={() => setDate ((prev) => ({... prev,dateTIme:time}))}>
                            {format(time,'kk:mm')}  {/* kk for military time */}
                        </button> 
                    </div>
                ))}
            </div>
            <div className="bg-stone-600">
                <div className="mt-12 m-5 bg-black">
                    dsjkfnasjnaissunsadnasljdnaskljn{/* AddButton= adds the date to the database */}
                </div>
            </div>
        </div>
    </div>

    )
}
export default index


