import mongoose, { Schema } from 'mongoose';

const questionSchema = new Schema({
    type: {
      type: String,
      enum: ['text', 'multipleChoice'],
      required: true,
    },
    text: String,
    choices: [String], 
    
  });

  const responseSchema = new Schema({
    answers: [String], 
    username: String,
  });

const surveySchema = new Schema(
    
    {

        title: String,
        description: String,
        frequency: {
          type: String,
          enum: ['daily', 'weekly', 'monthly'],
          required: true,
        },
        questions: [questionSchema],    
        responses: [responseSchema]
    },
    {
        timestamps: true,

    }


);

const Survey = mongoose.models.Survey || mongoose.model('Survey', surveySchema);
export default Survey; 