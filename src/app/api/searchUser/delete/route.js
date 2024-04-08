import { NextResponse } from "next/server";
import connect from "../../../../../db";
import User from "../../../../../models/userSchema";

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connect();
  await User.findByIdAndDelete(id);
  return NextResponse.json({ message: "User deleted" }, { status: 200 });
}