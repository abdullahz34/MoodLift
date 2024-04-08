
import connectMongoDB from "../../../../../libs/mongodb";
import Survey from "../../../../../models/survey";

import { NextResponse } from "next/server";

//const router = useRouter();


//update the survey
export async function PUT(request, { params }) {
  const { id } = params;
  const { newTitle: title, newDescription: description, newFrequency: frequency } = await request.json();
  await connectMongoDB();
  await Survey.findByIdAndUpdate(id, { title, description, frequency });
  return NextResponse.json({ message: "Survey updated" }, { status: 200 });
}

//get request to display all surveys
export async function GET(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  const survey = await Survey.findOne({ _id: id });
  return NextResponse.json({ survey }, { status: 200 });
  //router.refresh();
}

//answer a specific survey
export async function POST(request, { params }) {
  const { id } = params;
  const { answers } = await request.json();

  await connectMongoDB();
  const survey = await Survey.findById(id);

  if (!survey) {
    return NextResponse.json({ message: "Survey not found" }, { status: 404 });
  }

  const newResponse = { answers };
  survey.responses.push(newResponse);
  await survey.save();

  return NextResponse.json({ message: "Survey response saved" }, { status: 200 });
}