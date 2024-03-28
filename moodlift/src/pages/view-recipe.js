import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export const ViewRecipe = () => {

    const [recipes,setRecipes] = useState([]);

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            const res = await axios.get("http://localhost:3001/recipes/read");
            setRecipes(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (id) => {
        try{
            axios.delete(`http://localhost:3001/recipes/delete/${id}`);
            fetchRecipes();
        }

        catch (err){
            console.log(err);
        }
    }

    const navigate = useNavigate();

    const handleEdit = (id) => {
        navigate(`/edit-recipe/${id}`);
    };

    return (
        <div>
            <h1>Recipes</h1>

            <ul>
                {recipes.map((recipe) => (
                    <li key={recipe._id} className = "recipe">
                        <div>
                            <h2>{recipe.title}</h2>
                            <p><b>Prep time:</b> {recipe.prep} minutes</p>
                            <p><b>Calories:</b> {recipe.calories} Kj</p>
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

                            <button onClick = {() => {handleEdit(recipe._id)}}>Edit</button>
                            <button onClick = {() => {handleDelete(recipe._id)}}>Delete</button>

                        </div>
                    </li>
                ))}
            </ul>
        </div>

    )
}