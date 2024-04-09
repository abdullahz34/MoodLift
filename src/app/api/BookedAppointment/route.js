import { NextResponse } from "next/server";
import connect from "../../../../db";
import Appointment_Schema from "../../../../models/Appointment_Schema";



export const GET = async () => {
    try {
        await connect();

        const username = "Ambassador2"; // changing this to username of usersession later
        const appointments = await Appointment_Schema.find({ Ambassador_username: username });
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