import Video from "../../../../models/video";
import connectMongoDB from "../../../../libs/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();
  const videos = await Video.find();
  return NextResponse.json({ videos });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const videoData = body.formData;

    await Video.create(videoData);

    return NextResponse.json({ message: "Video Created" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
  
  export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await connectMongoDB();
    await Video.findByIdAndDelete(id);
    return NextResponse.json({ message: "Video deleted" }, { status: 200 });
  }