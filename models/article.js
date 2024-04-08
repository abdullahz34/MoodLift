import mongoose, {Schema} from "mongoose";
import connectMongoDB from "../libs/mongodb";

await connectMongoDB()
mongoose.Promise = global.Promise;

const articleSchema = new Schema({
  title: { type: String, required: true},
  summary: {type: String, required: true},
  content: {type: String, required: true},
  imgURL: { type: String,required: true},
});

const Article = mongoose.models.Article || mongoose.model("Article", articleSchema);
export default Article;