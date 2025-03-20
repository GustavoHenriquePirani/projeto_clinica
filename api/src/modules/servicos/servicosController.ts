import { Request, Response } from "express";
import Servico from "./servicosModel";

// Criar um novo serviço
export const createServico = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, descricao, valor, categoria } = req.body;
    const newServico = await Servico.create({
      name,
      descricao,
      valor,
      categoria,
    });
    res.status(201).json(newServico);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar serviço", error });
  }
};

// Listar todos os serviços
export const findAllServicos = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const servicos = await Servico.findAll();
    res.status(200).json(servicos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar serviços", error });
  }
};

// Buscar um serviço por ID
export const findServicoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const servico = await Servico.findByPk(Number(req.params.id));
    if (!servico) {
      res.status(404).json({ message: "Serviço não encontrado" });
      return;
    }
    res.status(200).json(servico);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar serviço", error });
  }
};

// Atualizar um serviço
export const updateServico = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const servico = await Servico.findByPk(Number(req.params.id));
    if (!servico) {
      res.status(404).json({ message: "Serviço não encontrado" });
      return;
    }

    const { name, descricao, valor, categoria } = req.body;
    await servico.update({ name, descricao, valor, categoria });
    res.status(200).json(servico);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar serviço", error });
  }
};

// Excluir um serviço
export const deleteServico = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const servico = await Servico.findByPk(Number(req.params.id));
    if (!servico) {
      res.status(404).json({ message: "Serviço não encontrado" });
      return;
    }

    await servico.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir serviço", error });
  }
};
