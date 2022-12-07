import dotenv from "dotenv";

dotenv.config({ path: "./env/.env" });

const config = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || "30d",
};

export default config;
