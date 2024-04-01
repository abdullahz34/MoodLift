import mongoose from "mongoose"

const feedbackSchema = new Schema(
    {
        msg: String 
    }
)

const Feedback = mongoose.model("Feedback",feedbackSchema)

export default Feedback