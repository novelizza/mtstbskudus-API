import express from "express";
import adminCtrl from "../controller/admin.controller.js";
import middlewareCtrl from "../controller/middleware.controller.js";

import multer from "multer";
import * as path from "path";

const uploadBanner = multer({
  storage: multer.diskStorage({
    destination: "./image/banner",
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: 2000000 },
});

const uploadGaleri = multer({
  storage: multer.diskStorage({
    destination: "./image/galeri",
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: 2000000 },
});

const uploadBrosur = multer({
  storage: multer.diskStorage({
    destination: "./image/brosur",
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: 2000000 },
});

const adminRoutes = express.Router();

adminRoutes
  .route("/")
  //web admin
  .get(middlewareCtrl.checkSessionAdmin, adminCtrl.getAdmin);

adminRoutes
  .route("/add-admin")
  //web admin
  .post(middlewareCtrl.checkSessionAdmin, adminCtrl.postAdmin)
  .put(middlewareCtrl.checkSessionAdmin, adminCtrl.ubahAdmin);

adminRoutes
  .route("/informasi")
  //web admin
  .get(middlewareCtrl.checkSessionAdmin, adminCtrl.getInformasi)
  //web admin
  .post(
    middlewareCtrl.checkSessionAdmin,
    uploadBanner.single("banner"),
    adminCtrl.postInformasi
  )
  //web admin
  .put(middlewareCtrl.checkSessionAdmin, adminCtrl.putContentInformasi)
  //web admin
  .delete(middlewareCtrl.checkSessionAdmin, adminCtrl.delInformasi);

adminRoutes
  .route("/galeri")
  .post(
    middlewareCtrl.checkSessionAdmin,
    uploadGaleri.array("foto"),
    adminCtrl.postGaleri
  );

adminRoutes
  .route("/nilai")
  .put(middlewareCtrl.checkSessionAdmin, adminCtrl.isiNilai);

adminRoutes
  .route("/dashboard")
  .get(middlewareCtrl.checkSessionAdmin, adminCtrl.dashboardAdmin);

adminRoutes
  .route("/data-siswa")
  .get(middlewareCtrl.checkSessionAdmin, adminCtrl.dataSiswaAdmin)
  .post(middlewareCtrl.checkSessionAdmin, adminCtrl.searchSiswaAdmin);

adminRoutes
  .route("/datamts-siswa")
  .get(middlewareCtrl.checkSessionAdmin, adminCtrl.dataSiswaMTSAdmin);

adminRoutes
  .route("/datampts-siswa")
  .get(middlewareCtrl.checkSessionAdmin, adminCtrl.dataSiswaMPTSAdmin);

adminRoutes
  .route("/datadaftarulang-siswa")
  .get(middlewareCtrl.checkSessionAdmin, adminCtrl.dataSiswaDaftarUlangAdmin);

adminRoutes
  .route("/detail-siswa")
  .get(middlewareCtrl.checkSessionAdmin, adminCtrl.detailSiswaAdmin);

adminRoutes
  .route("/cetak-data")
  .get(middlewareCtrl.checkSessionAdmin, adminCtrl.cetakDataAdmin)
  .post(middlewareCtrl.checkSessionAdmin, adminCtrl.searchCetakDataAdmin);

adminRoutes
  .route("/brosur")
  //di luar buat donlot brosur
  .get(adminCtrl.getDataBrosur)
  //di dalam login admin
  .post(
    middlewareCtrl.checkSessionAdmin,
    uploadBrosur.single("brosur"),
    adminCtrl.postBrosur
  );

export default adminRoutes;
