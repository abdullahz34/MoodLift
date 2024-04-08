import { NextResponse } from "next/server";
import connect from "../../../../db";
import ProfileSchema from "../../../../models/AmbassadorProfilePage_Schema";

export const GET = async () => {
    try {
        await connect();
        const profile = await ProfileSchema.find();
        return NextResponse.json(profile, { status: 200 });
    } catch (error) {
        console.error("Error in fetching appointments:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}; 

export async function POST(request) {

    try{
        const { username, name, gender,age, description} = await request.json();

        await connect();

        await ProfileSchema.findOneAndUpdate({username},{ username, name, gender,age, description},{ upsert: true, new: true, runValidators: true })

        return NextResponse.json({message:"Profile page added/edited succesfully"},{status:201})
        
    } catch (error){
    console.error("Error in adding/editing profile page", error);
    return NextResponse.json({ error: "Error in adding/editing profile page" }, { status: 500 });
    }
}