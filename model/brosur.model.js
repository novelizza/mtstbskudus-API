import Sequelize from "sequelize";
import db from "../config/database.js";

const Brosur = db.define(
  "brosur",
  {
    id_brosur: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    link: { type: Sequelize.STRING },
  },
  {
    freezeTableName: true,
  }
);

export default Brosur;
