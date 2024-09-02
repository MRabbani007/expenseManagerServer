import allowedOrigins from "./allowedOrigins.js";

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
  // origin: true,
  methods: ["GET", "HEAD", "PATCH", "POST", "DELETE", "OPTIONS"],
  credentials: true,
  // allowedHeaders: [
  //   "Origin",
  //   "Content-Type",
  //   "Accept",
  //   "Authorization",
  //   "X-Request-With",
  // ],
};

export default corsOptions;
