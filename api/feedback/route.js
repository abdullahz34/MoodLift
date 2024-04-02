import { NextResponse } from "next/server";
import connectMongoDB from "../../libs/mongodb"
import Feedback from "../../models/feedbackSchema";
import mongoose from "mongoose";

export async function POST(req) {
    const { message } = await req.json()
    try{
        await connectMongoDB();
        await Feedback.create()
        return NextResponse.json({
            msg: ["feedback message sent successfully"],
            success: true,
        })
    } catch(error) {
        if (error instanceof mongoose.error.ValidationError){
            let errorList = []
            for (let e in error.errors){
                errorList.push(error.errors[e].message)
            }
            return NextResponse.json({ msg: errorList })

        }
        else{
            return NextResponse.json({msg: "unable to send feedback"})
        }

    }
}