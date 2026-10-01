import { Request, Response } from "express";
import * as userRepository from "../repository/UserRepository";
import { CreateUsers, UpdateUsers } from "../models/user";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// VALIDAÇÃO: devolve a mensagem de erro, ou null se estiver tudo certo
// partial = true é usado no PUT (só valida os campos enviados)
function validateUser(body: any, partial = false): string | null {
  if (!body || typeof body !== "object") {
    return "Corpo da requisição inválido";
  }

  if (!partial || body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim() === "") {
      return "O nome é obrigatório";
    }
    if (body.name.trim().length > 100) {
      return "O nome deve ter no máximo 100 caracteres";
    }
  }

  if (!partial || body.email !== undefined) {
    if (typeof body.email !== "string" || body.email.trim() === "") {
      return "O e-mail é obrigatório";
    }
    if (body.email.trim().length > 255) {
      return "O e-mail deve ter no máximo 255 caracteres";
    }
    if (!EMAIL_REGEX.test(body.email.trim())) {
      return "O e-mail informado é inválido";
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
  if (error?.code === "23505") {
    return res.status(409).json({ error: "Já existe um usuário com este e-mail" });
  }
  if (error?.code === "23503") {
    return res
      .status(409)
      .json({ error: "Não é possível excluir um usuário que possui assinaturas" });
  }
  console.error(error);
  return res.status(500).json({ error: "Erro interno do servidor" });
}

// GET /users
export async function getAll(req: Request, res: Response) {
  try {
    const users = await userRepository.findAll();
    return res.status(200).json(users);
  } catch (error) {
    return handleError(res, error);
  }
}

// GET /users/:id
export async function getById(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const user = await userRepository.findById(id);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return handleError(res, error);
  }
}

// POST /users
export async function create(req: Request, res: Response) {
  try {
    const erro = validateUser(req.body);
    if (erro) {
      return res.status(400).json({ error: erro });
    }

    const user: CreateUsers = {
      name: req.body.name.trim(),
      email: req.body.email.trim().toLowerCase(),
      active: req.body.active ?? true,
    };

    const created = await userRepository.createUsers(user);
    return res.status(201).json(created);
  } catch (error) {
    return handleError(res, error);
  }
}

// PUT /users/:id
export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    const erro = validateUser(req.body, true);
    if (erro) {
      return res.status(400).json({ error: erro });
    }

    const user: UpdateUsers = {};
    if (req.body.name !== undefined) user.name = req.body.name.trim();
    if (req.body.email !== undefined) user.email = req.body.email.trim().toLowerCase();
    if (req.body.active !== undefined) user.active = req.body.active;

    if (Object.keys(user).length === 0) {
      return res.status(400).json({ error: "Envie ao menos um campo para atualizar" });
    }

    const updated = await userRepository.update(id, user);

    if (!updated) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    return res.status(200).json(updated);
  } catch (error) {
    return handleError(res, error);
  }
}

// DELETE /users/:id
export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const removed = await userRepository.remove(id);

    if (!removed) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error);
  }
}