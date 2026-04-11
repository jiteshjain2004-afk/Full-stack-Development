import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  appName: process.env.APP_NAME || "Dockerized Auth Dashboard",
  mongoUri: process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "change-this-secret",
  jwtExpiry: process.env.JWT_EXPIRES_IN || "1d",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:8080"
};
