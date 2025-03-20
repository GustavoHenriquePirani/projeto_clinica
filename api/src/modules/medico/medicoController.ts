import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import Medico from "./medicoModel";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadImagem = upload.single("fotoPerfil");

// Criar médico
export const createMedico = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    uploadImagem(req, res, async (error) => {
      if (error) {
        res.status(500).json({ message: "Erro no upload da imagem", error });
        return;
      }

      const { name, email, crm, descricao } = req.body;
      const fotoPerfil = req.file ? req.file.buffer : null;

      const medicoExistente = await Medico.findOne({ where: { crm } });
      if (medicoExistente) {
        res.status(400).json({ message: "Já existe um médico com esse CRM." });
        return;
      }

      const newMedico = await Medico.create({
        name,
        email,
        crm,
        descricao,
        fotoPerfil,
      });

      res.status(201).json(newMedico);
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar médico", error });
  }
};

// Buscar todos os médicos
export const findAllMedicos = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const medicos = await Medico.findAll();
    res.status(200).json(medicos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar os médicos", error });
  }
};

// Buscar médico por ID
export const findMedicoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const medico = await Medico.findByPk(Number(req.params.id));

    if (!medico) {
      res.status(404).json({ message: "Médico não encontrado" });
      return;
    }

    res.status(200).json(medico);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar médico", error });
  }
};

// Atualizar médico
export const updateMedico = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    uploadImagem(req, res, async (error) => {
      if (error) {
        res.status(500).json({ message: "Erro no upload da imagem", error });
        return;
      }

      const medico = await Medico.findByPk(Number(req.params.id));
      if (!medico) {
        res.status(404).json({ message: "Médico não encontrado" });
        return;
      }

      const { name, email, crm, descricao } = req.body;
      const fotoPerfil = req.file ? req.file.buffer : medico.fotoPerfil;

      await medico.update({
        name,
        email,
        crm,
        descricao,
        fotoPerfil,
      });

      res.status(200).json(medico);
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar médico", error });
  }
};

// Excluir médico
export const deleteMedico = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const medico = await Medico.findByPk(Number(req.params.id));
    if (!medico) {
      res.status(404).json({ message: "Médico não encontrado" });
      return;
    }

    await medico.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir médico", error });
  }
};

// Rota para obter a imagem do médico
export const getFotoPerfil = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const medico = await Medico.findByPk(Number(req.params.id), {
      attributes: ["fotoPerfil"],
    });

    if (!medico || !medico.fotoPerfil) {
      res.status(404).json({ message: "Imagem não encontrada" });
      return;
    }
    const imageBuffer = Buffer.isBuffer(medico.fotoPerfil)
      ? medico.fotoPerfil
      : Buffer.from(medico.fotoPerfil);

    res.setHeader("Content-Type", "image/png");

    res.send(imageBuffer);
  } catch (error) {
    console.error("Erro ao buscar imagem do médico:", error);
    res.status(500).json({ message: "Erro ao buscar imagem do médico" });
  }
};
