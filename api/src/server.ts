// import { getFotoPerfil } from "./modules/medico/medicoController";
import express from "express";
import cors from "cors";
import medicoRoutes from "./modules/medico/medicoRoutes";
import servicosRoutes from "./modules/servicos/servicosRoutes";
import { sequelize } from "./config/connection";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/clinica", (req, res) => {
  res.send("Bem-vindo à clínica!");
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados estabelecida com sucesso!");

    await sequelize.sync();

    app.use("/clinica", medicoRoutes);
    app.use("/clinica", servicosRoutes);

    const PORT = 8000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
  }
};

startServer();
