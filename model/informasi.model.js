import Sequelize from "sequelize";
import db from "../config/database.js";

const Akun = db.define(
  "informasi",
  {
    id_informasi: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    id_akun_admin: { type: Sequelize.INTEGER },
    banner: { type: Sequelize.STRING },
    judul: { type: Sequelize.STRING },
    deskripsi: { type: Sequelize.STRING },
  },
  {
    freezeTableName: true,
  }
);

export default Akun;
