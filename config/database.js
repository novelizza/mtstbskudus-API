import { Sequelize } from "sequelize";

const db = new Sequelize("tbs", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
