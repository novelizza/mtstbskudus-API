import { Sequelize } from "sequelize";

const db = new Sequelize("mtstbs", "admin_database", "AdminMtsTbsKudus2023=", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
