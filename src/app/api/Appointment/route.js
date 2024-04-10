import { NextResponse } from "next/server";
import connect from "../../../../db";
import Appointment_Schema from "../../../../models/Appointment_Schema";
import { format } from 'date-fns';


//create an appointment
export async function POST(request) {

    try{
        const { Ambassador_username, Employee_username, Date_Time,JustDate, Appointment_form} = await request.json();

        await connect();

        await Appointment_Schema.create({Ambassador_username, Employee_username, Date_Time, JustDate, Appointment_form})

        return NextResponse.json({message:"Added succesfully"},{status:201})
        
    } catch (error){
        console.error("Error in creating appointment", error);
        return NextResponse.json({ error: "Error in creating appointment" }, { status: 500 });
    }
}

export async function DELETE(request) {
    try{
        const { Ambassador_username, Employee_username, Date_Time,JustDate, Appointment_form} = await request.json();
        await connect();
        await Appointment_Schema.findOneAndDelete({Ambassador_username, Employee_username, Date_Time,JustDate, Appointment_form});
        return NextResponse.json({ message: "Appointment cancelled" }, { status: 200 });
    } catch (error){
        console.error("Error in deleting appointment", error);
        return NextResponse.json({ error: "Error in deleting appointment" }, { status: 500 });
    }
}

// fetch all booked appointment times for a given day
// export const GET= async (request) => {
//     try {
//         await connect();

//         const {date} = request.query;

//         // Fetch all booked appointments
//         // const appointments = await Appointment_Schema.find();
//         const appointments = await Appointment_Schema.find({JustDate: date});
//         // const appointments = await Appointment_Schema.find({ Date_Time: { $gte: new Date(date), $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) } });
//         // const appointments = await Appointment_Schema.find(date)
//         console.log("route.js",appointments)

//         // Extract the appointment times
//         // const bookedTimes = appointments.map(appointment => format(appointment.Date_Time, 'd:LLL kk:mm'));

//         const bookedTimes = appointments.map(appointment => appointment.Date_Time);
//         // const bookedTimesFormated= for (let index = 0; index < bookedTimes.length; index++) { bookedTimesFormated[index] = format(bookedTimes[index],'kk:mm');}
//         return NextResponse.json(bookedTimes, { status: 200 });
//     } catch (error) {
//         console.log("Error in fetching appointment times: " + error);
//         return NextResponse.error("Internal Server Error", { status: 500 });
//     }
// }

// export const GET= async (request) => {
//     try {
//         await connect();
        
//         const {date} = request.query;
//         // Fetch all booked appointments
//         const appointments = await Appointment_Schema.find({Date_Time: date});
        
//         // Extract the appointment times
//         // const bookedTimes = appointments.map(appointment => format(appointment.Date_Time, 'd LLL kk:mm'));

//         const bookedTimes = appointments.map(appointment => appointment.time);
//         // const bookedTimesFormated= for (let index = 0; index < bookedTimes.length; index++) { bookedTimesFormated[index] = format(bookedTimes[index],'kk:mm');}
//         return NextResponse.json(bookedTimes, { status: 200 });
//     } catch (error) {
//         console.log("Error in fetching appointment times: " + error);
//         return NextResponse.error("Internal Server Error", { status: 500 });
//     }
// }







// export async function DELETE(request) {

//     try{

//         const id = request.nextUrl.searchParams.get("id");

//         await connect();

//         await Appointment_Schema.findOneAndDelete()

//         return NextResponse.json({message:"deleted succesfully"},{status:201})
        
//     } catch (error){
//         console.error("Error in deleting appointment", error);
//         return NextResponse.json({ error: "Error in deleting appointment" }, { status: 500 });
//     }
// }

