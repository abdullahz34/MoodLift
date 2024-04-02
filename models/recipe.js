import mongoose, {Schema} from "mongoose";
import connectMongoDB from "@/libs/mongodb";

await connectMongoDB()
mongoose.Promise = global.Promise;

const recipeSchema = new Schema({
  title: { type: String, required: true},
  prep: { type: String, required: true},
  calories: { type: String, required: true},
  ingredients: [{ type: String,required: true}],
  instructions: [{ type: String, required: true}],
  imgURL: { type: String,required: true},
});

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);
export default Recipe;