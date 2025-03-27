import { Router } from "express";
import {
  findUserById,
  deleteUser,
  createUser,
  findAllUser,
  updateUser,
  loginUser,
} from "./userController";

const router = Router();

router.get("/user/listar", findAllUser);
router.get("/user/listar/:id", findUserById);
router.post("/user/login", loginUser);
router.post("/user/criar", createUser);
router.put("/user/editar/:id", updateUser);
router.delete("/user/deletar/:id", deleteUser);

export default router;
