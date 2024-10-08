import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import connectDB from "./src/config/dbConn.js";
import corsOptions from "./src/config/corsOptions.js";
import credentials from "./src/middleware/credentials.js";
import { logger } from "./src/middleware/logEvents.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import router from "./src/routes/router.js";
import { corsMiddleware } from "./src/middleware/corsMiddleware.js";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

dotenv.config({ path: path.resolve(`${__dirname}/src/config/.env`) });

const app = express();

const PORT = process.env.PORT || 3000;

// Connect to mongodb
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS
// and check cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));
app.options("*", cors());

app.use(corsMiddleware);

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: true }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

app.use("/", router);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

// Note: app will listen to port even if not connected to DB
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
