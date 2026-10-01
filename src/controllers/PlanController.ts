// IMPORTANDO
import { Request, Response } from "express";
import * as planRepository from "../repository/PlanRepository";
import { CreatePlans, UpdatePlans } from "../models/plan";

// VALIDAÇÃO: devolve a mensagem de erro, ou null se estiver tudo certo
function validatePlan(body: any, partial = false): string | null {

  if (!body || typeof body !== "object") {
    return "Corpo da requisição inválido";
  }

  if (!partial || body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim() === "") {
      return "O nome é obrigatório";
    }
    if (body.name.length > 50) {
      return "O nome deve ter no máximo 50 caracteres";
    }
  }

  if (body.description !== undefined && body.description !== null) {
    if (typeof body.description !== "string") {
      return "A descrição deve ser um texto";
    }
    if (body.description.length > 500) {
      return "A descrição deve ter no máximo 500 caracteres";
    }
  }

  if (!partial || body.price !== undefined) {
    if (typeof body.price !== "number" || !Number.isFinite(body.price) || body.price < 0) {
      return "O preço deve ser um número maior ou igual a 0";
    }
  }

  if (!partial || body.monthly_token_limit !== undefined) {
    if (!Number.isInteger(body.monthly_token_limit) || body.monthly_token_limit <= 0) {
      return "O limite de tokens deve ser um número inteiro maior que 0";
    }
  }

  if (body.active !== undefined && typeof body.active !== "boolean") {
    return "O campo active deve ser true ou false";
  }

  return null;
}

// TRADUZ ERROS DO BANCO PARA CÓDIGOS HTTP
function handleError(res: Response, error: any) {
  if (error?.code === "22P02") {
    return res.status(400).json({ error: "ID inválido" });
  }
  if (error?.code === "23503") {
    return res
      .status(409)
      .json({ error: "Não é possível excluir um plano que possui assinaturas" });
  }
  console.error(error);
  return res.status(500).json({ error: "Erro interno do servidor" });
}

// GET /plans
export async function getAll(req: Request, res: Response) {
  try {
    const plans = await planRepository.findAll();
    return res.status(200).json(plans);
  } catch (error) {
    return handleError(res, error);
  }
}

// GET /plans/:id
export async function getById(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const plan = await planRepository.findById(id);

    if (!plan) {
      return res.status(404).json({ error: "Plano não encontrado" });
    }
    return res.status(200).json(plan);
  } catch (error) {
    return handleError(res, error);
  }
}

// POST /plans
export async function create(req: Request, res: Response) {
  try {

    const erro = validatePlan(req.body);
    if (erro) {
      return res.status(400).json({ error: erro });
    }

    const plan: CreatePlans = {
      name: req.body.name.trim(),
      description: req.body.description ?? null,
      price: req.body.price,
      monthly_token_limit: req.body.monthly_token_limit,
      active: req.body.active ?? true,
    };

    const created = await planRepository.createPlans(plan);
    return res.status(201).json(created);
  } catch (error) {
    return handleError(res, error);
  }
}

// PUT /plans/:id
export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    const erro = validatePlan(req.body, true);
    if (erro) {
      return res.status(400).json({ error: erro });
    }

    const plan: UpdatePlans = {};
    if (req.body.name !== undefined) plan.name = req.body.name.trim();
    if (req.body.description !== undefined) plan.description = req.body.description;
    if (req.body.price !== undefined) plan.price = req.body.price;
    if (req.body.monthly_token_limit !== undefined) {
      plan.monthly_token_limit = req.body.monthly_token_limit;
    }
    if (req.body.active !== undefined) plan.active = req.body.active;

    if (Object.keys(plan).length === 0) {
      return res.status(400).json({ error: "Envie ao menos um campo para atualizar" });
    }

    const updated = await planRepository.update(id, plan);

    if (!updated) {
      return res.status(404).json({ error: "Plano não encontrado" });
    }
    return res.status(200).json(updated);
  } catch (error) {
    return handleError(res, error);
  }
}

// DELETE /plans/:id
export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const removed = await planRepository.remove(id);

    if (!removed) {
      return res.status(404).json({ error: "Plano não encontrado" });
    }
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error);
  }
}