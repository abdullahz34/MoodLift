import { NextResponse } from "next/server";
import connect from "../../../../db";
import { Logbook } from "../../../../models/logbookSchema";

export const GET = async (request) => {
    try {
        await connect();
        return NextResponse.json("Logbook fetched successfully", { status: 200 });
    } catch (error) {
        return NextResponse.error("Error in fetching logbook" + error, { status: 500 });
    }
};