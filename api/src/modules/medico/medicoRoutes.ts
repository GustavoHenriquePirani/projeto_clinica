import { Router } from "express";
import {
  findMedicoById,
  deleteMedico,
  createMedico,
  findAllMedicos,
  updateMedico,
  getFotoPerfil
} from "./medicoController";

const router = Router();

router.get("/medicos", findAllMedicos);
router.get("/medicos/:id", findMedicoById);
router.post("/medicos", createMedico);
router.put("/medicos/:id", updateMedico);
router.delete("/medicos/:id", deleteMedico);
router.get("/medicos/:id/foto", getFotoPerfil);

export default router;
