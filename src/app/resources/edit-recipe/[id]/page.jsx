import EditRecipeForm from "@/components/EditRecipeForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const getRecipeById = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/recipes/${id}`, {
        cache: "no-store",
      });
  
      if (!res.ok) {
        throw new Error("Failed to fetch recipe");
      }
  
      return res.json();
    } catch (error) {
      console.log(error);
    }
  };

export default async function EditRecipe({ params }){
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");

    const {id} = params;
    const {recipe} = await getRecipeById(id);
    const {title, prep, calories, ingredients, instructions, imgURL} = recipe;

    return(
        <EditRecipeForm id={id} newTitle={title} newPrep={prep} newCalories={calories} newIngredients={ingredients} newInstructions={instructions} newImgURL={imgURL}/>
    )
}