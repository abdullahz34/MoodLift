import mongoose from "mongoose"

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

const Feedback = mongoose.model("Feedback",feedbackSchema)

export default Feedback