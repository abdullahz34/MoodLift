import mongoose from "mongoose"
const Schema = mongoose.Schema;

const feedbackSchema = mongoose.Schema(
    {
        message: {
            type: String,
            required: [true]
        },

        creationDate: {
            type: Date,
            default: Date.now
        }
    }
)



export default mongoose.models.Feedback || mongoose.model("Feedback",feedbackSchema)