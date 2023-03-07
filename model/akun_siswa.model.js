import Sequelize from "sequelize";
import db from "../config/database.js";

const Akun = db.define(
  "akun_siswa",
  {
    id_akun_siswa: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    avatar: { type: Sequelize.STRING },
    username: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING },
    nama_lengkap: { type: Sequelize.STRING },
    nisn: { type: Sequelize.INTEGER },
    tempat_lahir: { type: Sequelize.STRING },
    tanggal_lahir: { type: Sequelize.DATEONLY },
    tahun_masuk: { type: Sequelize.STRING },
    tujuan_masuk: { type: Sequelize.ENUM("MTS", "MPTS", "DAFTAR ULANG") },
    no_hp_wali: { type: Sequelize.STRING },
    bayar: { type: Sequelize.BOOLEAN },
    nilai: { type: Sequelize.INTEGER },
    keterangan: { type: Sequelize.BOOLEAN },
    va: { type: Sequelize.STRING },
    trx_id: { type: Sequelize.STRING },
  },
  {
    freezeTableName: true,
  }
);

export default Akun;
