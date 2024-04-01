import {NextResponse} from "next/server";
import User from "../../../../models/userSchema"
import connect from "../../../../db";
import bcrypt from "bcryptjs"

export async function POST(req) {
  try {
    const {username, password, type} = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    await connect();
    await User.create({username, password: hashedPassword, type})

    return NextResponse.json(
      { message: "user signed up" },
      { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {message: "error occurred signing up user"},
      {status: 500})
  }
}