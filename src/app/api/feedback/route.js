import { NextResponse } from "next/server";
import connect from "../../../../db";
import Feedback from "../../../../models/feedbackSchema";
import mongoose from "mongoose";

export async function POST(req) {
    const { message,username } = await req.json()
    try{
        await connect();
        await Feedback.create({ message,username })
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

export async function GET(req) {
    try {
        await connect();
        const allFeedback = await Feedback.find()
        allFeedback.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
        return NextResponse.json(allFeedback, {stauts:200})

    } catch(error) {
        return NextResponse.json({msg: "Error while fetching feedback"})
    }
}