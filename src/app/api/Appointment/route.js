import { NextResponse } from "next/server";
import connect from "../../../../db";
import Appointment from "../../../../models/Appointment";

export const GET= async (request) => {

    try {
        await connect();
        const appointments = await Appointment.find();
        return new NextResponse(JSON.stringify(appointments),{status:200});
    } catch (error) {
        return new NextResponse("Error in fetching appointments " + error, {status:500});
    }
}
