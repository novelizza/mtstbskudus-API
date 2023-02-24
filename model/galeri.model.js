import Sequelize from "sequelize";
import db from "../config/database.js";

const Akun = db.define(
  "galeri",
  {
    id_galeri: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    id_informasi: { type: Sequelize.INTEGER },
    foto: { type: Sequelize.STRING },
  },
  {
    freezeTableName: true,
  }
);

export default Akun;
