// import { getFotoPerfil } from "./modules/medico/medicoController";
import express from "express";
import cors from "cors";
import medicoRoutes from "./modules/medico/medicoRoutes";
import servicosRoutes from "./modules/servicos/servicosRoutes";
import userRoutes from "./modules/user/userRoutes";
import { sequelize } from "./config/connection";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados estabelecida com sucesso!");

    await sequelize.sync({ alter: true });

    app.use("/clinica", medicoRoutes);
    app.use("/clinica", servicosRoutes);
    app.use("/clinica", userRoutes);

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
  }
};

startServer();
