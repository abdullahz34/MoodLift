import { NextResponse } from "next/server";
import User from "../../../../../models/userSchema";
import connect from "../../../../../db";

export async function GET(request) {
  try {
    await connect();
    const users = await User.find();
    const { searchParams } = new URL(request.url);
    console.log(request.url);
    const query = searchParams.get('query');
  
    const filteredUsers = users.filter((user) => {
      return user.username.toLowerCase().includes(query.toLowerCase()) || user.name.toLowerCase().includes(query.toLowerCase())
    })
  
    return new NextResponse(JSON.stringify(filteredUsers), {status:200});
  } catch(error) {
    return new NextResponse("Error in fetching users " + error, {status:500})
  }
}