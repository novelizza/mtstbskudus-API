import express from "express";
import authCtrl from "../controller/auth.controller.js";
import middlewareCtrl from "../controller/middleware.controller.js";

const authRoutes = express.Router();

authRoutes
  .route("/siswa")
  //login web siswa
  .post(authCtrl.authSiswa)
  //belum ada
  // .put(authCtrl.resetPassword)
  // logout web siswa
  .delete(middlewareCtrl.checkSessionSiswa, authCtrl.logoutSiswa);

authRoutes
  .route("/admin")
  //login web guru
  .post(authCtrl.authAdmin)
  //belum ada
  // .put(authCtrl.resetPassword)
  // belum ada
  .delete(middlewareCtrl.checkSessionAdmin, authCtrl.logoutAdmin);

export default authRoutes;
