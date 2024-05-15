import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
   await mongoose.connect(process.env.MONGODB_URI);
   console.log("database connection successfull");
  } catch (error) {
    console.log("err in connecting database");
  }
};
