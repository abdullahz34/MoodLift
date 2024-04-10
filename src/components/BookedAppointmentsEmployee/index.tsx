'use client';
import React, { FC, useEffect, useState } from "react";
import {format} from 'date-fns';

interface Appointment {
  Ambassador_username: string;
  Employee_username: string;
  Date_Time: Date;
  JustDate: string;
  Appointment_form: string;
}
const AppointmentList: FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  
  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/BookedAppointmentEmployee");
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const appointments = await response.json();
      // console.log("Fetched appointments:", appointments); // Add this line
      return appointments;
      
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  }

  const deleteAppointment = async (appointment: any) => {
    try {
      const response = await fetch('/api/Appointment', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }
  
      const data = await response.json();
      console.log(data.message);
      // Optionally, you can update the state by filtering out the deleted appointment
      setAppointments(appointments.filter((a) => a !== appointment));
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentsData = await fetchAppointments();
        setAppointments(appointmentsData);
        
        
          
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchData();
  }, []);
  
  return (
    <div className=" backdrop-blur-sm bg-slate-500/5 rounded-3xl ">
        {appointments.length > 0 ? (
            <table className="table">
                <thead>
                <tr className="bg-base-200">
                    <th></th>
                    <th>Ambassador</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Form</th>
                    <th>Cancel</th>
                </tr>
                </thead>
                <tbody>
                {appointments.map((appointment, index) => (
                    <tr key={index}>
                        <td>{index+1}</td>
                        <td className="pr-2">{appointment.Ambassador_username}</td>
                        <td>{appointment.JustDate}</td>
                        <td>{format(appointment.Date_Time,'kk:mm')}</td>
                        <td>{appointment.Appointment_form}</td>
                        <td><button className="btn btn-sm btn-error" onClick={() => deleteAppointment(appointment)}>Cancel</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        ):(
            <div className="text-center py-4">No Scheduled Appointments</div>
        )}
    </div>
  );
};

export default AppointmentList;






































// 'use client';
// import { FC,useEffect,useState } from "react"
// import {} from "date-fns";

// interface Appointment {
//     Ambassador_username: string;
//     Date_Time: string;
//     JustDate: string;
//     Appointment_form: string;
// }

// interface indexProps{};

// const index: FC<indexProps> = ({}) => {

//     const [appointments, setAppointments] = useState<Appointment[]>([]);

//     async function fetchAppointments (Ambassador_username: String) {
//         try {
//             const response = await fetch(`http://localhost:3000/api/BookedAppointment?username=${Ambassador_username}`,{ cache: "no-store" });
//             if (!response.ok) {
//                 throw new Error('Failed to fetch appointments for username');
//             }
//             const appointments= await response.json();
//             console.log('appointments', appointments);
//             return appointments;
//         } catch (error) {
//             console.error('Error fetching appointments:',error);
//             throw error;
//         }
//     }

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const appointments = await fetchAppointments("Ambassador1");
//                 setAppointments(appointments);
//             } catch (error) {
//                 console.error('Error setting appointments:', error);
//             }
//         };
//         fetchData();
//     }, []);
    
//     return (
//     <div className="overflow-x-auto backdrop-blur-sm bg-slate-500/5 w-min rounded-3xl h-full p-10">
//     <table className="table">
//         {/* head */}
//         <thead>
//         <tr>
//             <th></th>
//             <th>Ambassador</th>
//             <th>Date</th>
//             <th>Starting Time</th>
//             <th>Form</th>
//         </tr>
//         </thead>

//         <tbody>
//         {/* row 1 */}
//         <tr className="bg-base-200">
//             <th>1</th>
//             <td>Name 1</td>
//             <td>9:00</td>
//             <td>Online</td>
//         </tr>
//         {/* row 2 */}
//         <tr>
//             <th>2</th>
//             <td>Name 2</td>
//             <td>15:00</td>
//             <td>Inperson</td>
//         </tr>
//         {/* row 3 */}
//         {/* {Appointments.map()} */}
//         <tr>
//             <th>3</th>
//             <td>Name 3</td>
//             <td>12:00</td>
//             <td>Online</td>
//         </tr>
//         </tbody>
//     </table>
//     </div>

//     )
// }
// export default index;