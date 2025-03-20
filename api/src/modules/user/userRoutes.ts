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

router.get("/user", findAllUser);
router.get("/user/:id", findUserById);
router.post("/user/login", loginUser);
router.post("/user", createUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

export default router;
