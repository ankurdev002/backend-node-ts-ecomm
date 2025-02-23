import dotenv from "dotenv";

dotenv.config();

console.log("DB Config:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USERNAME);
console.log(
  "DB_PASS:",
  typeof process.env.DB_PASSWORD,
  `"${process.env.DB_PASSWORD}"`
);
console.log("DB_NAME:", process.env.DB_NAME);
