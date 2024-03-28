import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useRecipeId } from "../hooks/useRecipeId";

export const EditRecipe = () => {
    const recipeId = useRecipeId();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState({
        title: "",
        prep: 0,
        calories: 0,
        ingredients: [],
        instructions: [],
        imgURL: ""
    });

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/recipes/read/${recipeId}`);
                setRecipe(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchRecipe();
    }, [recipeId]);


    const handleChange = (event) => {
        const { name, value } = event.target;
        setRecipe({ ...recipe, [name]: value });
    };

    const handleArrayItem = (event, index, type) => {
        const { value } = event.target;
        setRecipe(prevRecipe => {
          const updatedRecipe = { ...prevRecipe };
          updatedRecipe[type][index] = value;
          return updatedRecipe;
        });
      };
      
      const addArrayItem = (type) => {
        setRecipe(prevRecipe => {
          const updatedRecipe = { ...prevRecipe };
          updatedRecipe[type] = [...updatedRecipe[type], ""];
          return updatedRecipe;
        });
      };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`http://localhost:3001/recipes/update/${recipeId}`, recipe);
            navigate("/view-recipe");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="createRecipe">
            <h2>Edit Recipe</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" value={recipe.title} onChange={handleChange} />

                <label htmlFor="prep">Prep Time (minutes)</label>
                <input type="text" id="prep" name="prep" value={recipe.prep} onChange={handleChange}/>

                <label htmlFor="calories">Calories (kJ)</label>
                <input type="text" id="calories" name="calories" value={recipe.calories} onChange={handleChange}/>

                <label htmlFor="ingredients">Ingredients</label>
                {recipe.ingredients.map((ingredient, i) => (
                    <input key={i} type="text" name="ingredients" value={ingredient} onChange={(event) => handleArrayItem(event, i, "ingredients")}/>
                ))}
                <button onClick={() => addArrayItem("ingredients")} type="button">Add Ingredient</button>


                <label htmlFor="instructions">Instructions</label>
                {recipe.instructions.map((instruction, i) =>(
                    <input key={i} type="text" name="instrutions" value={instruction} onChange={(event) => handleArrayItem(event,i, "instructions")}/>
                ))}
                <button onClick={() => addArrayItem("instructions")} type="button">Add instruction</button>

                <label htmlFor="imgURL">Image URL</label>
                <input type="text" id="imgURL" name="imgURL" value={recipe.imgURL} onChange={handleChange}/>
                
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};
