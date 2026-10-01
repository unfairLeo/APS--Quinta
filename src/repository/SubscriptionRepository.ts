import { supabase } from "../config/supabase";
import {
  Subscriptions,
  CreateSubscriptions,
  UpdateSubscriptions,
} from "../models/subscription";

// LISTAR TODAS AS ASSINATURAS (filtro opcional por status)
export async function findAll(status?: string): Promise<Subscriptions[]> {
  let query = supabase.from("subscriptions").select("*");

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data as Subscriptions[];
}

// BUSCAR POR ID (.eq = WHERE)
export async function findById(id: string): Promise<Subscriptions | null> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data as Subscriptions | null;
}

// CRIAR
export async function createSubscriptions(
  subscription: CreateSubscriptions
): Promise<Subscriptions> {
  const { data, error } = await supabase
    .from("subscriptions")
    .insert(subscription)
    .select()
    .single();

  if (error) throw error;

  return data as Subscriptions;
}

// ATUALIZAR
export async function update(
  id: string,
  subscription: UpdateSubscriptions
): Promise<Subscriptions | null> {
  const { data, error } = await supabase
    .from("subscriptions")
    .update(subscription)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw error;

  return data as Subscriptions | null;
}

// EXCLUIR (devolve false se o id não existia)
export async function remove(id: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("subscriptions")
    .delete()
    .eq("id", id)
    .select();

  if (error) throw error;

  return data.length > 0;
}