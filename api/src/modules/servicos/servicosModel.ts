import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/connection";

class Servico extends Model {
  public id!: number;
  public name!: string;
  public descricao!: string;
  public valor!: number;
  public categoria!: string;
}

Servico.init(
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
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valor: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Servicos",
  }
);

export default Servico;
