import { NextResponse } from "next/server";
import connect from "../../../../db";
import Survey from "../../../../models/survey";

export const GET = async (request) => {
  try {
    await connect();
    const users = await Logbook.find();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error in fetching logbook:", error); 

    const errorMessage =
      error.message || "An error occurred while fetching logbooks"; 
    return NextResponse.json({ error: errorMessage }, { status: 500 }); 
  }
};
