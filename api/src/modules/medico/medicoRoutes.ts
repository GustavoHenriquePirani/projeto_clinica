import { Router } from "express";
import {
  findMedicoById,
  deleteMedico,
  createMedico,
  findAllMedicos,
  updateMedico,
  getFotoPerfil,
} from "./medicoController";

const router = Router();

router.get("/medicos/listar", findAllMedicos);
router.get("/medicos/listar/:id", findMedicoById);
router.post("/medicos/criar", createMedico);
router.put("/medicos/editar/:id", updateMedico);
router.delete("/medicos/deletar/:id", deleteMedico);
router.get("/medicos/:id/foto", getFotoPerfil);

export default router;
