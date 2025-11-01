import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MonmgoDB connection error:", error);
  }
};

// import mongoose from "mongoose";

// async function connectDB(url) {
//   return mongoose.connect(url);
// }

// export default connectDB;
