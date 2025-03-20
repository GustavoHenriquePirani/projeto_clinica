import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("clinica", "postgres", "root123", {
  host: "localhost",
  dialect: "postgres",
});
