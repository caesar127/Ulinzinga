import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const db = await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log(`MongoDB Connected: ${db.connection.host}`);
  } catch (error) {
    process.exit(1);
  }
};

export default connectDB;
