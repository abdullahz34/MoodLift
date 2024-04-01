import connectMongoDB from "@/libs/mongodb";
import Video from "@/models/video";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
      const { id } = params;

      const body = await request.json();
      const videoData = body;

      const updatedVideo = await Video.findByIdAndUpdate(id, videoData, { new: true });

      return NextResponse.json({ message: "Video updated", updatedVideo }, { status: 200 });
  } catch (error) {
      console.log(error);
      return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  const video = await Video.findOne({ _id: id });
  return NextResponse.json({ video }, { status: 200 });
}