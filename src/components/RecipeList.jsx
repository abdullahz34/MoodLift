import Link from "next/link";
import DeleteButton from "./DeleteButton";
import { getServerSession } from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";



const getRecipes = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/recipes", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch recipes");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading recipes: ", error);
  }
};




export default async function RecipeList() {
  const { recipes } = await getRecipes();
  const session = await getServerSession(authOptions);

  if (session && (session.user.type === 'Superadmin' || session.user.type === 'Admin' || session.user.type === 'Ambassador')) {

  return (
    <div className="flex flex-col w-1/3">
      <>
        {recipes.map((recipe) => (
          <div key={recipe._id} className="p-4 border border-slate-300 rounded my-3 flex justify-between gap-5 items-start">
            <div>
                <h2 className="font-bold text-2xl">{recipe.title}</h2>
                <div>Prep Time: {recipe.prep}</div>
                <div>Calories: {recipe.calories}</div>
                <img src={recipe.imgURL} alt={recipe.title}/>
                <h3 className="font-bold">Ingredients</h3>
                <ul className="list-disc list-inside">
                    {recipe.ingredients.map((ingredient) => (
                        <li key={ingredient}>{ingredient}</li>
                    ))}
                </ul>
                
                <h3 className="font-bold">Instructions</h3>
                <ol className="list-decimal list-inside">
                    {recipe.instructions.map((instruction) => (
                        <li key={instruction}>{instruction}</li>
                    ))}
                </ol>

                  <Link href={`./edit-recipe/${recipe._id}`}>
                    <button className="btn">Edit</button>
                  </Link>
                  <DeleteButton id={recipe._id} route={"recipes"} className="btn"/>

            </div>
          </div>
        ))}
      </>
    </div>
  );
  }

  else{
    return(
      <div className="flex flex-col w-1/3">
      <>
        {recipes.map((recipe) => (
          <div key={recipe._id} className="p-4 border border-slate-300 rounded my-3 flex justify-between gap-5 items-start">
            <div>
                <h2 className="font-bold text-2xl">{recipe.title}</h2>
                <div>Prep Time: {recipe.prep}</div>
                <div>Calories: {recipe.calories}</div>
                <img src={recipe.imgURL} alt={recipe.title}/>
                <h3 className="font-bold">Ingredients</h3>
                <ul className="list-disc list-inside">
                    {recipe.ingredients.map((ingredient) => (
                        <li key={ingredient}>{ingredient}</li>
                    ))}
                </ul>
                
                <h3 className="font-bold">Instructions</h3>
                <ol className="list-decimal list-inside">
                    {recipe.instructions.map((instruction) => (
                        <li key={instruction}>{instruction}</li>
                    ))}
                </ol>
            </div>
          </div>
        ))}
      </>
      </div>
    )
  }
}