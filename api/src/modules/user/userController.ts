import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./userModel";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuarios", error });
  }
};

export const findAllUser = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findAll();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar os usuarios", error });
  }
};

export const findUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findByPk(Number(req.params.id));

    if (!user) {
      res.status(404).json({ message: "Usuario não encontrado" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuario", error });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findByPk(Number(req.params.id));
    if (!user) {
      res.status(404).json({ message: "Usuario não encontrado" });
      return;
    }

    const { name, email, password } = req.body;
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : user.password;

    await user.update({
      name,
      email,
      password: hashedPassword,
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar médico", error });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findByPk(Number(req.params.id));
    if (!user) {
      res.status(404).json({ message: "Usuario não encontrado" });
      return;
    }
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir médico", error });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "E-mail e senha são obrigatórios." });
      return;
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({ message: "Credenciais inválidas." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Credenciais inválidas." });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login realizado com sucesso!",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Erro ao processar login:", error);
    res.status(500).json({ message: "Erro ao processar login." });
  }
};
