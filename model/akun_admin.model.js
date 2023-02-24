import Sequelize from "sequelize";
import db from "../config/database.js";

const Akun = db.define(
  "akun_admin",
  {
    id_akun_admin: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    nama_lengkap: { type: Sequelize.STRING },
    nip: { type: Sequelize.STRING },
    username: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING },
  },
  {
    freezeTableName: true,
  }
);

export default Akun;
