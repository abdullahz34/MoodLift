import mongoose from "mongoose";

const recipeSchema = mongoose.Schema({
  title: { type: String, required: true},
  prep: { type: Number,required: true},
  calories: { type: Number,required: true},
  ingredients: [{ type: String,required: true}],
  instructions: [{ type: String, required: true}],
  imgURL: { type: String,required: true},
});

export const RecipesModel = mongoose.model("Recipes", recipeSchema);