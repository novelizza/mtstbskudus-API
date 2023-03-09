import express from "express";
import siswaCtrl from "../controller/siswa.controller.js";
import middlewareCtrl from "../controller/middleware.controller.js";

import multer from "multer";
import * as path from "path";

const uploadAvatar = multer({
  storage: multer.diskStorage({
    destination: "./image/siswa",
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: 2000000 },
});

const siswaRoutes = express.Router();

siswaRoutes
  .route("/")
  //web siswa
  .get(middlewareCtrl.checkSessionSiswa, siswaCtrl.getSiswa)
  //register siswa
  .post(uploadAvatar.single("avatar"), siswaCtrl.postSiswa)
  .put(middlewareCtrl.checkSessionSiswa, siswaCtrl.ubahSiswa);

siswaRoutes
  .route("/ubah-avatar")
  //ubah ava only
  .put(
    middlewareCtrl.checkSessionSiswa,
    uploadAvatar.single("avatar"),
    siswaCtrl.ubahAvaSiswa
  );

siswaRoutes
  .route("/data-siswa")
  //insert data siswa
  .get(middlewareCtrl.checkSessionSiswa, siswaCtrl.getDataSiswa)
  //insert data siswa
  .post(middlewareCtrl.checkSessionSiswa, siswaCtrl.data_siswa);

siswaRoutes
  .route("/data-orangtua")
  //insert data orang tua
  .get(middlewareCtrl.checkSessionSiswa, siswaCtrl.getDataOrangTua)
  //insert data orang tua
  .post(middlewareCtrl.checkSessionSiswa, siswaCtrl.data_orang_tua);

siswaRoutes
  .route("/data-alamat")
  //insert data alamat
  .get(middlewareCtrl.checkSessionSiswa, siswaCtrl.getDataAlamat)
  //insert data alamat
  .post(middlewareCtrl.checkSessionSiswa, siswaCtrl.data_alamat);

siswaRoutes
  .route("/data-prestasi")
  //insert data prestasi
  .get(middlewareCtrl.checkSessionSiswa, siswaCtrl.getDataPrestasi)
  //insert data prestasi
  .post(middlewareCtrl.checkSessionSiswa, siswaCtrl.prestasi_siswa);

siswaRoutes
  .route("/callback")
  //test callback
  .post(siswaCtrl.callbackURL)
  //test callback
  .get(siswaCtrl.callbackURL);

export default siswaRoutes;
