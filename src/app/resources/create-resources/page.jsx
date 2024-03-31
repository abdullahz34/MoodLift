"use client"
import {useState} from "react";
import { useRouter } from "next/navigation";

const CreateRecipe = () => {

    const startingRecipeData = {
        title: "",
        prep: 0,
        calories: 0,
        ingredients: [],
        instructions: [],
        imgURL: ""
    };

    const [formData, setFormData] = useState(startingRecipeData);

    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
    
        setFormData((preState) => ({
          ...preState,
          [name]: value,
        }));
      };

    const handleArrayItem = (event, index, type) => {
        const { value } = event.target;
        setFormData(prevRecipe => {
          const updatedRecipe = { ...prevRecipe };
          updatedRecipe[type][index] = value;
          return updatedRecipe;
        });
      };
      
      const addArrayItem = (type) => {
        setFormData(prevRecipe => {
          const updatedRecipe = { ...prevRecipe };
          updatedRecipe[type] = [...updatedRecipe[type], ""];
          return updatedRecipe;
        });
      };

    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            const res = await fetch("http://localhost:3000/api/recipes", {
                method: "POST",
                body: JSON.stringify({formData}),
                headers: {
                    "Content-Type": "application/json",
                }
            });

            console.log(res)
            console.log(JSON.stringify({formData}))

            if (res.ok){
                router.push("/resources");
            }

            else{
                throw new Error("Failed to create recipe");
            }
        }

        catch(error){
            console.error(error)
        }
    };

    return(
        <div>
            <h2>Create a recipe</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" onChange={handleChange}/>

                <label htmlFor="prep">Prep Time (minutes)</label>
                <input type="text" id="prep" name="prep" onChange={handleChange}/>

                <label htmlFor="calories">Calories (kJ)</label>
                <input type="text" id="calories" name="calories" onChange={handleChange}/>

                <label htmlFor="ingredients">Ingredients</label>
                {formData.ingredients.map((ingredient, i) => (
                    <input key={i} type="text" name="ingredients" id={`ingredient-${i}`} value={ingredient} onChange={(event) => handleArrayItem(event, i, "ingredients")}/>
                ))}
                <button onClick={() => addArrayItem("ingredients")} type="button">Add Ingredient</button>


                <label htmlFor="instructions">Instructions</label>
                {formData.instructions.map((instruction, i) =>(
                    <input key={i} type="text" name="instructions" id={`instruction-${i}`} value={instruction} onChange={(event) => handleArrayItem(event,i, "instructions")}/>
                ))}
                <button onClick={() => addArrayItem("instructions")} type="button">Add instruction</button>

                <label htmlFor="imgURL">Image URL</label>
                <input type="text" id="imgURL" name="imgURL" onChange={handleChange}/>

                <button type="submit">Add Recipe</button>
            </form>
        </div>
        
    )
}

export default CreateRecipe;