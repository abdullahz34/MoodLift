import { NextResponse } from "next/server";
import connect from "../../../../db";
import Logbook from "../../../../models/logbookSchema";

export const GET = async (req) => {
  try {
    let scheduleTime = null;
    await connect();
    const currentUser = await fetch('http://localhost:3000/api/auth/session', {headers: {cookie: req.cookies.toString()}}).then(res => res.json()).then(data => data.user.username);
    const users = await Logbook.find({ username: currentUser });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error in fetching logbook:", error); // Log detailed error message

    const errorMessage =
      error.message || "An error occurred while fetching logbooks"; // Provide a generic error message if needed
    return NextResponse.json({ error: errorMessage }, { status: 500 }); // Return a JSON response with the error message
  }
};
