import Sequelize from "sequelize";
import db from "../config/database.js";

const Ujian = db.define(
  "ujian",
  {
    id_ujian: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    id_akun_siswa: { type: Sequelize.INTEGER },
    nomor_ujian: { type: Sequelize.STRING },
  },
  {
    freezeTableName: true,
  }
);

export default Ujian;
