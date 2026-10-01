import { supabase } from "../config/supabase";
import { Users, CreateUsers, UpdateUsers } from "../models/user";

// LISTAR TODOS OS USUÁRIOS
export async function findAll(): Promise<Users[]> {
  const { data, error } = await supabase.from("users").select("*");

  if (error) throw error;

  return data as Users[];
}

// BUSCAR POR ID (.eq = WHERE)
export async function findById(id: string): Promise<Users | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data as Users | null;
}

// CRIAR
export async function createUsers(user: CreateUsers): Promise<Users> {
  const { data, error } = await supabase
    .from("users")
    .insert(user)
    .select()
    .single();

  if (error) throw error;

  return data as Users;
}

// ATUALIZAR
export async function update(id: string, user: UpdateUsers): Promise<Users | null> {
  const { data, error } = await supabase
    .from("users")
    .update(user)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw error;

  return data as Users | null;
}

// EXCLUIR (devolve false se o id não existia)
export async function remove(id: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("id", id)
    .select();

  if (error) throw error;

  return data.length > 0;
}