import Link from "next/link"
import DeleteButton from "./DeleteButton"

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

  return (
    <>
      {recipes.map((recipe) => (
        <div key={recipe._id} className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start">
          <div>
              <h2 className="font-bold text-2xl">{recipe.title}</h2>
              <div>Prep Time: {recipe.prep}</div>
              <div>Calories: {recipe.calories}</div>
              <img src={recipe.imgURL} alt={recipe.title}/>
              <h3>Ingredients</h3>
              <ul className="ingredientsList">
                  {recipe.ingredients.map((ingredient) => (
                      <li key={ingredient}>{ingredient}</li>
                  ))}
              </ul>
              
              <h3>Instructions</h3>
              <ol>
                  {recipe.instructions.map((instruction) => (
                      <li key={instruction}>{instruction}</li>
                  ))}
              </ol>
          </div>

          <Link href={`resources/edit-recipe/${recipe._id}`}>Edit</Link>
          <DeleteButton id={recipe._id}/>

        </div>
      ))}
    </>
  );
}