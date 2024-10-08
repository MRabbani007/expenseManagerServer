import allowedOrigins from "../config/allowedOrigins.js";

const credentials = (req, res, next) => {
  // console.log("Credentials");
  const origin = req.headers?.origin;

  if (!origin) return res.sendStatus(403);

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
  }
  // console.log("Credentials passed");
  next();
};

export default credentials;
