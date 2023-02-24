import express from "express";
import route from "./routes/index.js";
import db from "./config/database.js";
import dotenv from "dotenv/config";

const app = express();

app.use("/api", route);

app.listen(process.env.PORT, () =>
  console.log("Server is running at port " + process.env.PORT)
);
app.get("/", (req, res) => {
  res.send("Use /api to url base TBS API");
});

try {
  await db.authenticate();
  console.log("Database Connected...");
} catch (error) {
  console.log("Not connect to Database.");
}
