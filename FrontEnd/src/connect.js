import mongoose from 'mongoose';

const uri = "mongodb+srv://ecommerce:AUST2024@cluster0.nqscb37.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // other options if needed
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("MongoDB connected successfully.");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
