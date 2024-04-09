import Article from "../../../../models/article";
import connectMongoDB from "../../../../libs/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();
  const articles = await Article.find();
  return NextResponse.json({ articles });
}

export async function POST(request) {
  const { title, summary, content, imgURL } = await request.json();
  await connectMongoDB();
  await Article.create({ title, summary, content, imgURL });
  return NextResponse.json({ message: "Article Created" }, { status: 201 });
}
  
  export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await connectMongoDB();
    await Article.findByIdAndDelete(id);
    return NextResponse.json({ message: "Article deleted" }, { status: 200 });
  }