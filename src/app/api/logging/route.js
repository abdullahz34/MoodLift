import { NextResponse } from "next/server";
import connect from "../../../../db";
import { Logbook } from "../../../../models/logbookSchema";

export const GET = async (request) => {
  try {
    await connect();

    const logbooks = await Logbook.find(); // Fetch all logbooks

    return NextResponse.json(logbooks, { status: 200 }); // Return the fetched logbooks
  } catch (error) {
    console.error("Error in fetching logbook:", error); // Log detailed error message

    const errorMessage =
      error.message || "An error occurred while fetching logbooks"; // Provide a generic error message if needed
    return NextResponse.json({ error: errorMessage }, { status: 500 }); // Return a JSON response with the error message
  }
};