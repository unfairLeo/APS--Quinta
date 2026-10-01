import { Request, Response } from "express";
import * as subscriptionRepository from "../repository/SubscriptionRepository";
import * as userRepository from "../repository/UserRepository";
import * as planRepository from "../repository/PlanRepository";
import { CreateSubscriptions, UpdateSubscriptions } from "../models/subscription";

const VALID_STATUS = ["active", "canceled", "expired"];
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(value: any): boolean {
  return typeof value === "string" && UUID_REGEX.test(value);
}

// Aceita só datas reais no formato AAAA-MM-DD
function isValidDate(value: any): boolean {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

// VALIDAÇÃO: devolve a mensagem de erro, ou null se estiver tudo certo
// partial = true é usado no PUT (só valida os campos enviados)
function validateSubscription(body: any, partial = false): string | null {
  if (!body || typeof body !== "object") {
    return "Corpo da requisição inválido";
  }

  if (!partial || body.user_id !== undefined) {
    if (!isUuid(body.user_id)) {
      return "O user_id é obrigatório e deve ser um UUID válido";
    }
  }

  if (!partial || body.plan_id !== undefined) {
    if (!isUuid(body.plan_id)) {
      return "O plan_id é obrigatório e deve ser um UUID válido";
    }
  }

  if (body.status !== undefined && !VALID_STATUS.includes(body.status)) {
    return "O status deve ser active, canceled ou expired";
  }

  if (body.renewal_date !== undefined && body.renewal_date !== null) {
    if (!isValidDate(body.renewal_date)) {
      return "A renewal_date deve ser uma data válida no formato AAAA-MM-DD";
    }
  }

  return null;
}

// REGRAS DE NEGÓCIO: usuário e plano precisam existir e estar ativos
async function checkUser(userId: string): Promise<string | null> {
  const user = await userRepository.findById(userId);
  if (!user) return "Usuário não encontrado";
  if (!user.active) return "Usuário inativo";
  return null;
}

async function checkPlan(planId: string): Promise<string | null> {
  const plan = await planRepository.findById(planId);
  if (!plan) return "Plano não encontrado";
  if (!plan.active) return "Não é possível assinar um plano inativo";
  return null;
}

// TRADUZ ERROS DO BANCO PARA CÓDIGOS HTTP
function handleError(res: Response, error: any) {
  if (error?.code === "22P02") {
    return res.status(400).json({ error: "ID inválido" });
  }
  if (error?.code === "23503") {
    return res.status(400).json({ error: "Usuário ou plano informado não existe" });
  }
  console.error(error);
  return res.status(500).json({ error: "Erro interno do servidor" });
}

// GET /subscriptions  (filtro opcional: ?status=active)
export async function getAll(req: Request, res: Response) {
  try {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;

    if (status !== undefined && !VALID_STATUS.includes(status)) {
      return res
        .status(400)
        .json({ error: "O status deve ser active, canceled ou expired" });
    }

    const subscriptions = await subscriptionRepository.findAll(status);
    return res.status(200).json(subscriptions);
  } catch (error) {
    return handleError(res, error);
  }
}

// GET /subscriptions/:id
export async function getById(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const subscription = await subscriptionRepository.findById(id);

    if (!subscription) {
      return res.status(404).json({ error: "Assinatura não encontrada" });
    }
    return res.status(200).json(subscription);
  } catch (error) {
    return handleError(res, error);
  }
}

// POST /subscriptions
export async function create(req: Request, res: Response) {
  try {
    const erro = validateSubscription(req.body);
    if (erro) {
      return res.status(400).json({ error: erro });
    }

    const erroUser = await checkUser(req.body.user_id);
    if (erroUser) {
      return res.status(400).json({ error: erroUser });
    }

    const erroPlan = await checkPlan(req.body.plan_id);
    if (erroPlan) {
      return res.status(400).json({ error: erroPlan });
    }

    const subscription: CreateSubscriptions = {
      user_id: req.body.user_id,
      plan_id: req.body.plan_id,
      status: req.body.status ?? "active",
      renewal_date: req.body.renewal_date ?? null,
    };

    const created = await subscriptionRepository.createSubscriptions(subscription);
    return res.status(201).json(created);
  } catch (error) {
    return handleError(res, error);
  }
}

// PUT /subscriptions/:id
export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    const erro = validateSubscription(req.body, true);
    if (erro) {
      return res.status(400).json({ error: erro });
    }

    const subscription: UpdateSubscriptions = {};
    if (req.body.user_id !== undefined) subscription.user_id = req.body.user_id;
    if (req.body.plan_id !== undefined) subscription.plan_id = req.body.plan_id;
    if (req.body.status !== undefined) subscription.status = req.body.status;
    if (req.body.renewal_date !== undefined) {
      subscription.renewal_date = req.body.renewal_date;
    }

    if (Object.keys(subscription).length === 0) {
      return res.status(400).json({ error: "Envie ao menos um campo para atualizar" });
    }

    // Só revalida o usuário/plano se eles estiverem sendo trocados
    if (subscription.user_id) {
      const erroUser = await checkUser(subscription.user_id);
      if (erroUser) {
        return res.status(400).json({ error: erroUser });
      }
    }

    if (subscription.plan_id) {
      const erroPlan = await checkPlan(subscription.plan_id);
      if (erroPlan) {
        return res.status(400).json({ error: erroPlan });
      }
    }

    const updated = await subscriptionRepository.update(id, subscription);

    if (!updated) {
      return res.status(404).json({ error: "Assinatura não encontrada" });
    }
    return res.status(200).json(updated);
  } catch (error) {
    return handleError(res, error);
  }
}

// DELETE /subscriptions/:id
export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const removed = await subscriptionRepository.remove(id);

    if (!removed) {
      return res.status(404).json({ error: "Assinatura não encontrada" });
    }
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error);
  }
}