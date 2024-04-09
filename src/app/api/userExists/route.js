import connect from "../../../../db";
import User from "../../../../models/userSchema";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connect();
    const {username} = await req.json()
    const user = await User.findOne({username}).select("_id")
    console.log("User: ", user)
    return NextResponse.json({user})
  } catch (error) {
    console.log(error)
  }
}