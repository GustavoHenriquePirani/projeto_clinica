import { Router } from "express";
import {
  findServicoById,
  deleteServico,
  createServico,
  findAllServicos,
  updateServico,
} from "./servicosController";

const router = Router();

router.get("/servicos", findAllServicos);
router.get("/servicos/:id", findServicoById);
router.post("/servicos", createServico);
router.put("/servicos/:id", updateServico);
router.delete("/servicos/:id", deleteServico);

export default router;
