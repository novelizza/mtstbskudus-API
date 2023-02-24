import Sequelize from "sequelize";
import db from "../config/database.js";

const SessionSiswa = db.define(
  "session_admin",
  {
    id_session_admin: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    id_akun_admin: { type: Sequelize.INTEGER },
    session: { type: Sequelize.STRING },
    expire_value: { type: Sequelize.INTEGER },
    expired_at: { type: Sequelize.DATE },
  },
  {
    freezeTableName: true,
  }
);

export default SessionSiswa;
