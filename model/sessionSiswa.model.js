import Sequelize from "sequelize";
import db from "../config/database.js";

const SessionSiswa = db.define(
  "session_siswa",
  {
    id_session_siswa: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    id_akun_siswa: { type: Sequelize.INTEGER },
    session: { type: Sequelize.STRING },
    expire_value: { type: Sequelize.INTEGER },
    expired_at: { type: Sequelize.DATE },
  },
  {
    freezeTableName: true,
  }
);

export default SessionSiswa;
