import { NextResponse } from "next/server";
import connect from "../../../../db";
import Appointment from "../../../../models/Appointment_Schema";

export const GET = async (req) => {
  try {
    let scheduleTime = null;
    await connect();
    const userAppointment = await fetch('http://localhost:3000/api/auth/session', {headers: {cookie: req.cookies.toString()}}).then(res => res.json()).then(data => data.user.username);
    const users = await Appointment.find({ Employee_username: userAppointment });
    let upcomingAppointments = [];
    users.forEach((appointment) => {
        scheduleTime = new Date(appointment.Date_Time) - 3*60*60*1000;
        if (scheduleTime > new Date()) {
            upcomingAppointments.push(appointment);
        }
    });
    return NextResponse.json(upcomingAppointments);
  } catch (error) {
    console.error("Error in fetching logbook:", error); // Log detailed error message

    const errorMessage =
      error.message || "An error occurred while fetching logbooks"; // Provide a generic error message if needed
    return NextResponse.json({ error: errorMessage }, { status: 500 }); // Return a JSON response with the error message
  }
};
