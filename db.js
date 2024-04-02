import mongoose from 'mongoose';

const connect = async () => {

    try{
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Mongo connection successfull");
    } catch (error) {
        throw new Error("Error in connecting to MongoDB");
    }
}

export default connect;