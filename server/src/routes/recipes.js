import express from "express";
import { RecipesModel } from "../modules/recipeModel.js";

const router = express.Router();

// reading data from the database
router.get("/read", async (req,res) => {
    try{
        const response = await RecipesModel.find({});
        res.status(200).json(response);
    }
    catch(err){
        res.status(500).json(err);
    }
})

// Get a recipe by ID
router.get("/read/:recipeId", async (req, res) => {
    try {
      const result = await RecipesModel.findById(req.params['recipeId']);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// posting data to the database
router.post("/post", async (req,res) => {
    const recipe = new RecipesModel(req.body);
    try{
        const response = await recipe.save();
        res.status(201).json(response);
    }
    catch(err){
        res.status(500).json(err);
    }
})

// deleting data from the database
router.delete("/delete/:id", async(req,res) => {
    const id = req.params['id'];
    try{
        await RecipesModel.findByIdAndDelete(id);
        res.status(200).send("item deleted");
    }
    catch(err){
        res.json(err);
    }
})

//updating data entry
router.put("/update/:id", async(req,res) => {
    try{
        const updatedRecipe  = await RecipesModel.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.status(201).json(updatedRecipe);
    }
    catch(err){
        res.status(500).json(err);
    }
})

export { router as recipesRouter };