'use client';
import React, { FC, useEffect, useState } from "react";


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
      const response = await fetch("http://localhost:3000/api/BookedAppointment");
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const appointments = await response.json();
      return appointments;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  }
  
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
      <table className="table">
        <thead>
          <tr className="bg-base-200">
            <th></th>
            <th>Employee</th>
            <th >Date</th>
            {/* <th>Time</th> */}
            <th>Form</th>
            <th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <tr key={index}>
                <td>{index}</td>
                <td className="pr-2">{appointment.Employee_username}</td>
                <td>{appointment.JustDate}</td>
                {/* <td>{appointment.Date_Time}</td> */}
                <td>{appointment.Appointment_form}</td>
                <td><button className="btn btn-sm btn-error">Cancel</button></td>
            </tr>
          ))}
        </tbody>
      </table>
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