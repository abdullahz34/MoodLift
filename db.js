import mongoose from 'mongoose';

const connect = async () => {
  try {
    await mongoose.connect("mongodb+srv://mlhmytran:541AxS8g7jm9EEy9@cluster0.uthobww.mongodb.net/", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB: ', error);
  }
};

export default connect;