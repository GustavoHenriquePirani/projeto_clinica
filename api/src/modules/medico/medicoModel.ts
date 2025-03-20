import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/connection";

class Medico extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public crm!: string;
  public descricao?: string | null;
  public fotoPerfil?: Buffer | null;
}

Medico.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    crm: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fotoPerfil: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "Medico",
  }
);

export default Medico;
