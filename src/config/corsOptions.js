import allowedOrigins from "./allowedOrigins.js";

const corsOptions = {
  // origin: (origin, callback) => {
  //   if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error("Not allowed by CORS"));
  //   }
  // },
  optionsSuccessStatus: 200,
  // origin: true,
  methods: ["GET", "HEAD", "PATCH", "POST", "DELETE", "OPTIONS"],
  origin: ["https://mrabbani007.github.io", "http://localhost:5173"], // Allow only frontend
  credentials: true, // Allow cookies/sessions
  allowedHeaders: ["Content-Type", "Authorization"],
  // allowedHeaders: [
  //   "Origin",
  //   "Content-Type",
  //   "Accept",
  //   "Authorization",
  //   "X-Request-With",
  // ],
};

export default corsOptions;
