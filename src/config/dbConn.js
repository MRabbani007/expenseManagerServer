import mongoose from "mongoose";

mongoose.set("strictQuery", false);

export default async function connectDB() {
  try {
    if (!process.env.DATABASE_URI) {
      throw new Error("Provide DB URI");
    }

    await mongoose.connect(process.env.DATABASE_URI, {
      // useUnifiedTopology: true,
      // useNewUrlParser: true,
    });
  } catch (err) {
    console.error("Error Connecting to DB");
  }
}
