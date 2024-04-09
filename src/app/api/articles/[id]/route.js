import connectMongoDB from "../../../../../libs/mongodb";
import Article from "../../../../../models/article";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
      const { id } = params;

      const body = await request.json();
      const articleData = body;

      const updatedArticle = await Article.findByIdAndUpdate(id, articleData, { new: true });

      return NextResponse.json({ message: "Article updated", updatedArticle }, { status: 200 });
  } catch (error) {
      console.log(error);
      return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  const article = await Article.findOne({ _id: id });
  return NextResponse.json({ article }, { status: 200 });
}