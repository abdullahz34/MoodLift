import connectMongoDB from "@/libs/mongodb";
import Recipe from "@/models/recipe";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    try {
        const { id } = params;
    
        const body = await req.json();
        const recipeData = body.formData;
    
        const updateTicketData = await Recipe.findByIdAndUpdate(id, {
          ...recipeData,
        });
    
        return NextResponse.json({ message: "Recipe updated" }, { status: 200 });
      } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error", error }, { status: 500 });
      }
    }

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  const recipe = await Recipe.findOne({ _id: id });
  return NextResponse.json({ recipe }, { status: 200 });
}