import { Router } from "express";
import {
  findServicoById,
  deleteServico,
  createServico,
  findAllServicos,
  updateServico,
} from "./servicosController";

const router = Router();

router.get("/servicos/listar", findAllServicos);
router.get("/servicos/listar/:id", findServicoById);
router.post("/servicos/criar", createServico);
router.put("/servicos/editar/:id", updateServico);
router.delete("/servicos/deletar/:id", deleteServico);

export default router;
