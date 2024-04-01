"use client";
import { useState } from "react";
import {useRouter} from "next/navigation";

export default function EditRecipeForm({id, newTitle, newPrep, newCalories, newIngredients, newInstructions, newImgURL}){

    const startingRecipeData = {
        title: newTitle,
        prep: newPrep,
        calories: newCalories,
        ingredients: newIngredients,
        instructions: newInstructions,
        imgURL: newImgURL
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
            const res = await fetch(`http://localhost:3000/api/recipes/${id}`, {
                method: "PUT",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (res.ok){
                router.push("/resources/view-recipes");
                router.refresh();
            }

            else{
                throw new Error("Failed to edit recipe");
            }
        }

        catch(error){
            console.error(error)
        }
    };

    const handleDelete = (i) => {
        setFormData(prevRecipe => {
            const updatedInstructions = [...prevRecipe.instructions];
            updatedInstructions.splice(i, 1);
            return {
                ...prevRecipe,
                instructions: updatedInstructions
            };
        });
    };

    return(
        <div className="flex justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-1/3">
                <h2>Edit recipe</h2>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="input input-bordered"/>

                <label htmlFor="prep">Prep Time</label>
                <input type="text" id="prep" name="prep" value={formData.prep} onChange={handleChange} className="input input-bordered"/>

                <label htmlFor="calories">Calories</label>
                <input type="text" id="calories" name="calories" value={formData.calories} onChange={handleChange} className="input input-bordered"/>

                <label htmlFor="ingredients">Ingredients</label>
                {formData.ingredients.map((ingredient, i) => (
                    <div>
                        <input key={i} type="text" name="ingredients" id={`ingredient-${i}`} value={ingredient} onChange={(event) => handleArrayItem(event, i, "ingredients")} className="input input-bordered"/>
                        <button onClick={() => handleDelete(i)} type="button">x</button>
                    </div>
                ))}
                <button onClick={() => addArrayItem("ingredients")} type="button" className="btn">Add Ingredient</button>


                <label htmlFor="instructions">Instructions</label>
                {formData.instructions.map((instruction, i) =>(
                    <div>
                        <input key={i} type="text" name="instructions" id={`instruction-${i}`} value={instruction} onChange={(event) => handleArrayItem(event,i, "instructions")} className="input input-bordered"/>
                        <button onClick={() => handleDelete(i)} type="button">x</button>
                    </div>
                ))}
                <button onClick={() => addArrayItem("instructions")} type="button" className="btn">Add instruction</button>

                <label htmlFor="imgURL">Image URL</label>
                <input type="text" id="imgURL" name="imgURL" value={formData.imgURL} onChange={handleChange} className="input input-bordered"/>

                <button type="submit" className="btn">Edit Recipe</button>
            </form>
        </div>
    )
}