import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { recipesRouter } from "./routes/recipes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/recipes", recipesRouter);

mongoose.connect(
  "mongodb+srv://oncntao:swepmongodb@moodlift.dbujelh.mongodb.net/moodlift?retryWrites=true&w=majority&appName=moodlift",

);

app.listen(3001, () => console.log("Server started"))