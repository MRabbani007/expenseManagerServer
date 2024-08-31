import mongoose from "mongoose";
import * as path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import.meta.url;

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

dotenv.config({ path: path.resolve(`${__dirname}/config/.env`) });

const uri = process.env.ATLAS_URI;

// Connect to Mongoose
const Main = async () => {
  //process.env.MONGODB_URI
  if (!uri) return null;

  await mongoose
    .connect(uri, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    })
    .then((dbo) => {
      console.log("mongodb connected");
    })
    .catch(() => {
      console.log("Mongo.js: failed");
    });
};

Main().catch((err) => console.log(err));
