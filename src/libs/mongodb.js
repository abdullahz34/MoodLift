import mongoose from 'mongoose';

const connectMongoDB = async () =>{
    try{
        await mongoose.connect("mongodb+srv://oncntao:swepmongodb@moodlift.dbujelh.mongodb.net/moodlift")
        console.log("Connected to MongoDB");
    }
    catch (error){
        console.log(error);
    }
};

export default connectMongoDB;