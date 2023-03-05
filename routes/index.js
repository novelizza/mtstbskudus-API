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

indexRouter.use("/avatar", express.static("image/siswa"));
indexRouter.use("/galeri", express.static("image/galeri"));
indexRouter.use("/brosur", express.static("image/brosur"));
indexRouter.use("/banner", express.static("image/banner"));

indexRouter.use("/auth", authRoute);
indexRouter.use("/siswa", siswaRoute);
indexRouter.use("/admin", adminRoute);

export default indexRouter;
