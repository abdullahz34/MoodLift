import Recipe from "../../../../models/recipe";
import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();
  const recipes = await Recipe.find();
  return NextResponse.json({ recipes });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const recipeData = body.formData;

    await Recipe.create(recipeData);

    return NextResponse.json({ message: "Recipe Created" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
  
  export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await connectMongoDB();
    await Recipe.findByIdAndDelete(id);
    return NextResponse.json({ message: "Recipe deleted" }, { status: 200 });
  }