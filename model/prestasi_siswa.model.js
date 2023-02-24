import Sequelize from "sequelize";
import db from "../config/database.js";

const Akun = db.define(
  "prestasi_siswa",
  {
    id_prestasi_siswa: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    id_akun_siswa: { type: Sequelize.INTEGER },
    prestasi_ke: { type: Sequelize.INTEGER },
    tahun: { type: Sequelize.STRING },
    nama_lomba: { type: Sequelize.STRING },
    bidang_lomba: { type: Sequelize.STRING },
    nama_penyelenggara: { type: Sequelize.STRING },
    lomba_tingkat: { type: Sequelize.STRING },
    peringkat_diraih: { type: Sequelize.STRING },
  },
  {
    freezeTableName: true,
  }
);

export default Akun;
