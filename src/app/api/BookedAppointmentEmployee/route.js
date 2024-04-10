import { NextResponse } from "next/server";
import connect from "../../../../db";
import Appointment_Schema from "../../../../models/Appointment_Schema";

import { getServerSession } from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export const GET = async () => {
    try {
        await connect();

        const session = await getServerSession(authOptions);

        const username = session.user.username;

        // console.log("Employee username:", username); // Log the username
        
        const appointments = await Appointment_Schema.find({ Employee_username: username });
        // console.log("Fetched appointments:", appointments); // Log the fetched appointments

        appointments.sort((a, b) => a.Date_Time - b.Date_Time); //sorting array based on closest Date_time

        return NextResponse.json(appointments, { status: 200 });
    } catch (error) {
        console.error("Error in fetching appointments:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}; 