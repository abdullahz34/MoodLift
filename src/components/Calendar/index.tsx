'use client';
import React, { FC, useState, useEffect } from "react"
import ReactCalendar from 'react-calendar'
import '../Calendar/CalendarStyle.css';
import {add,format} from 'date-fns';
import Alert from '@/components/Alert/index'
import Error from '@/components/Alert/error'

import { useSession } from "next-auth/react";

interface indexProps{}

interface DateType{
    justDate:Date | null
    dateTime:Date | null
}

// const index: FC<indexProps> = ({}) => { 

export default function Calendar() {

    const { data: session, status } = useSession();
    const [showAlert, setShowAlert] = useState(false);// alert
    const [Message,SetMessage]=useState('')

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Time Selection
    const[date,setDate] = useState<DateType>({
        justDate: null,
        dateTime: null,
    })
    

    const[FormButton,setForm]= useState(false)
    const[Employee_username,setEmployee_username]= useState('')
    const [Ambassadorusername, setAmbassador_username] = useState('');
    const [ToggleAppointmentForm, setToggleAppointmentForm] = useState('Video Call')
    

    useEffect(() => {
        if (session?.user) {
            setAmbassador_username(session.user.username as string);
        }
    }, [session]);

    console.log('Selected Date:', date.justDate);
    // console.log(date.dateTime)
    // console.log(bookedTimes)
    // console.log(date.justDate)
    

    const getTimes = () => {
        
        if(!date.justDate) date.justDate= new Date()

        const {justDate} = date
        date.justDate.setHours(0)
        date.justDate.setMinutes(0)
        date.justDate.setSeconds(0)

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

    const handleFormChange= () =>{
        setForm(!FormButton)
        if (ToggleAppointmentForm === 'Video Call') {
            setToggleAppointmentForm('1-on-1 Messaging');
        } else if (ToggleAppointmentForm === '1-on-1 Messaging') {
            setToggleAppointmentForm('Video Call');
        }
    }

    const JustdateString = date.justDate ? format(date.justDate,'dd/MM/yyyy') : '';

    const scheduleButton = async () => {
        try {
            //this
            if (!Employee_username) {
                setErrorMessage('Please enter an employee username.');
                setShowErrorAlert(true);
                setTimeout(() => setShowErrorAlert(false), 5000);
                return;
              }

            //this
            // Check if no day or time is selected
            if (!date.justDate || !date.dateTime) {
                setErrorMessage('Please select a day and time.');
                setShowErrorAlert(true);
                setTimeout(() => setShowErrorAlert(false), 5000);
                return;
            }


            const data = {
                Ambassador_username:Ambassadorusername,
                Employee_username,
                Date_Time: date.dateTime ,//? format(date.dateTime, 'yyyy-MM-dd kk:mm') : '',
                JustDate: JustdateString,
                Appointment_form: ToggleAppointmentForm
            };
            const response = await fetch('/api/Appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData); // Handle success response

                // Format the appointment time
                const appointmentTime = format(date.dateTime!, 'kk:mm');


                // Create the alert message with the appointment details
                const alertMessage = `Appointment scheduled with ${Employee_username} on ${JustdateString} at ${appointmentTime}. Please refresh the page`;
                SetMessage(alertMessage)

                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 8000);

            } else if (response.status === 409) {

                setErrorMessage('The selected date and time are already booked. Please choose a different slot.');
                setShowErrorAlert(true);
                setTimeout(() => setShowErrorAlert(false), 5000);
            
            }else {
                console.error('Failed to send data:', response.statusText); // Handle error response
            }
        } catch (error) {
            console.error('Error:', error); // Handle network or other errors
        }
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
      };
    
    const times=getTimes()

    return (
        <div className="flex flex-row p-2 backdrop-blur-sm bg-slate-500/5 w-fit rounded-3xl ">
            {showAlert && <Alert message={Message} onClose={handleCloseAlert} />}
            {showErrorAlert && <Error message={errorMessage} onClose={() => setShowErrorAlert(false)} />}


            {/* AppointmentSelection= Calendar and RightSide */}
            <ReactCalendar  
                minDate={new Date()} 
                className='REACT-CALENDAR p-2' 
                view='month' 
                onClickDay={(date) => setDate(prevDate => ({ ...prevDate, justDate: date }))}/>


            
            <div className="flex flex-col ">
                {/* Rightside= Time Button Search bar*/}

                <input
                    type="text" 
                    placeholder="Employee Username" 
                    className="input input-bordered w-full max-w-xs" 
                    value={Employee_username} 
                    onChange={(e) => setEmployee_username(e.target.value)} // Update the employee username state
                />
            

                {/* Grid for numbers */}
                <div className="grid grid-cols-3 gap-4 px-5 pt-5">
                    {times?.map((time,i) => (

                        <div key={`time-${i}`} className="p-2">
                            <button 
                            type='button' 
                            className='btn'
                            onClick={() => setDate(prevDate => ({ ...prevDate, dateTime: time }))}>
                                {format(time,'kk:mm')}  {/* kk for military time */}
                            </button> 
                        </div>
                    ))}
                </div>
                
                <div className="flex flex-row self-center pt-4">
                    <div className="pl-5 pr-5">Video Call </div>

                    {/* Toggle button */}
                    <div>
                    <input type="checkbox"
                        onChange={handleFormChange}
                        className="toggle toggle-success"
                        checked={FormButton}/>
                    </div>
                
                    <div className="pl-5 pr-5">1-on-1 Messaging</div>
                </div>

                {/* Schedule Button */}
                <div className="self-center py-3">
                    <button className="btn btn-wide btn-success" onClick={scheduleButton}>Schedule</button>
                </div>


            </div>
        </div>
    )
}
// export default index;


