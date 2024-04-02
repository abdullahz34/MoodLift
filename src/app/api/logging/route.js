import { NextResponse } from "next/server";
import connect from "../../../../db";
import Logbook from "../../../../models/logbookSchema";

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

export const POST = async (request) => {
  try {
    const { username, date, fitness, nutrition, hydration, sleep } = await request.json();
    await connect();
    await Logbook.findOneAndUpdate(
      { username, date }, // find a document with this filter
      { username, date, fitness, nutrition, hydration, sleep }, // document to insert when nothing was found
      { upsert: true, new: true, runValidators: true } // options
    );
    return NextResponse.json({ message: "Logbook entry created or updated successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error in creating or updating logbook entry:", error);
    const errorMessage = error.message || "An error occurred while creating or updating logbook entry";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};