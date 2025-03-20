import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("postgresql://postgres:QNQsXqTbmMFnhdFxcrMjdrgsfcXcXZjS@hopper.proxy.rlwy.net:14855/railway", {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true, 
      rejectUnauthorized: false, 
    },
  },
});
