import connect from "../../../../../../db";
import User from "../../../../../../models/userSchema";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    await connect();
    const user = await User.findOne({ _id: id })
    console.log("User: ", user)
    return new NextResponse(JSON.stringify({user}), {status:200})
  } catch (error) {
    return new NextResponse("Error in fetching user " + error, {status:500})
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const { newUsername: username, newName: name, newPassword: password, newType: type } = await request.json();
  await connect();
  await User.findByIdAndUpdate(id, { username, name, password, type });
  return NextResponse.json({ message: "User updated" }, { status: 200 });
}