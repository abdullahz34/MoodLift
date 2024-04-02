import mongoose, {Schema} from "mongoose";
import connectMongoDB from "@/libs/mongodb";

await connectMongoDB()
mongoose.Promise = global.Promise;

const videoSchema = new Schema({
  title: { type: String, required: true},
  videoURL: { type: String,required: true},
  description: { type: String, required: true},
});

const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);
export default Video;