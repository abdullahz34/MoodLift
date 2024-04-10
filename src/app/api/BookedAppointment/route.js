import { NextResponse } from "next/server";
import connect from "../../../../db";
import Appointment_Schema from "../../../../models/Appointment_Schema";

import { getServerSession } from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export const GET = async () => {
    try {
        await connect();

        const session = await getServerSession(authOptions);

        const username = session.user.username; // changing this to username of usersession later
        
        const appointments = await Appointment_Schema.find({ Ambassador_username: username });

        appointments.sort((a, b) => a.Date_Time - b.Date_Time); //sorting array based on closest Date_time

        return NextResponse.json(appointments, { status: 200 });
    } catch (error) {
        console.error("Error in fetching appointments:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}; 

// export const GET = async () => {
//     try {
//         await connect();

//         const username= "Ambassador1"
//         const appointments = await Appointment_Schema.find({Ambassador_username: username});
//         return NextResponse.json(appointments, { status: 200 });
//     } catch (error) {
//         console.error("Error in fetching appointments:", error);
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }; 






























// export const GET = async () => {
//     try {
//         await connect();

//         const username= "Ambassador1"
//         const appointments = await Appointment_Schema.find({Ambassador_username: username});
//         return NextResponse.json(appointments, { status: 200 });
//     } catch (error) {
//         console.error("Error in fetching appointments:", error);
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }; 