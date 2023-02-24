import express from "express";
import authRoute from "./auth.route.js";
import siswaRoute from "./siswa.route.js";
import adminRoute from "./admin.route.js";
import cors from "cors";

const indexRouter = express.Router();
indexRouter.use(express.urlencoded({ extended: true }));
indexRouter.use(cors());

indexRouter.get("/", (req, res) => {
  res.send("Wellcome to TBS API!");
});

indexRouter.use("/auth", authRoute);
indexRouter.use("/siswa", siswaRoute);
indexRouter.use("/admin", adminRoute);

export default indexRouter;
