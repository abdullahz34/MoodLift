import { NextResponse } from "next/server";
import connect from "../../../../db";
import RequestAmbassadorSchema from "../../../../models/RequestAmbassador_Schema.js";

export const GET = async () => {
    try {
        await connect();
        const Request = await RequestAmbassadorSchema.find();
        return NextResponse.json(Request, { status: 200 });
    } catch (error) {
        console.error("Error in fetching Requests:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}; 

export async function POST(request) {

    try{
        const { Ambassador_username, Employee_username,Severity,Reason, Appointment_Preference} = await request.json();

        await connect();

        await RequestAmbassadorSchema.findOneAndUpdate({Ambassador_username, Employee_username},{ Ambassador_username, Employee_username,Severity, Reason, Appointment_Preference},{ upsert: true, new: true, runValidators: true })

        return NextResponse.json({message:"Request Sent Succefully"},{status:201})
        
    } catch (error){
    console.error("Error in adding/editing Request", error);
    return NextResponse.json({ error: "Error in adding/editing Request" }, { status: 500 });
    }
}

export async function DELETE(request) {
    try{
        const { Ambassador_username, Employee_username,Severity,Reason, Appointment_Preference} = await request.json();
        await connect();
        await RequestAmbassadorSchema.findOneAndDelete({ Ambassador_username, Employee_username,Severity,Reason, Appointment_Preference});
        return NextResponse.json({ message: "Request cancelled" }, { status: 200 });
    } catch (error){
        console.error("Error in deleting request", error);
        return NextResponse.json({ error: "Error in deleting request" }, { status: 500 });
    }
}