import connectMongoDB from "../../../../libs/mongodb";
import { NextResponse } from "next/server";
import Survey from "../../../../models/survey";

//post essential components of survey title, description, questions, frequency
export async function POST(request) {
    const { title, description, questions, frequency } = await request.json();
    await connectMongoDB();
    await Survey.create({ title, description, questions, frequency });
    return NextResponse.json({ message: "Survey Created" }, { status: 201 });
  }
//retrieve and sort all surveys in mongoDB
  export async function GET() {
    await connectMongoDB();
    const surveys = await Survey.find();
    surveys.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return NextResponse.json({ surveys });
  }
  //request deletion of a survey by id
  export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await connectMongoDB();
    await Survey.findByIdAndDelete(id);
    return NextResponse.json({ message: "survey deleted" }, { status: 200 });
  }