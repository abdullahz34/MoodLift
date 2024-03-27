import express from "express";
import { RecipesModel } from "../modules/recipeModel.js";

const router = express.Router();

router.get("/read", async (req,res) => {
    try{
        const response = await RecipesModel.find({});
        res.json(response);
    }
    catch(err){
        res.json(err);
    }
})

router.post("/post", async (req,res) => {
    const recipe = new RecipesModel(req.body);
    try{
        const response = await recipe.save();
        res.json(response);
    }
    catch(err){
        res.json(err);
    }
})

router.delete("/delete/:id", async(req,res) => {
    const id = req.params['id'];
    await RecipesModel.findByIdAndDelete(id);
    res.send("item deleted");
})

export { router as recipesRouter };