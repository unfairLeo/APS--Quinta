// IMPORTANDO SUPABASE DO SUPABASE.TS
import { supabase } from "../config/supabase";
import { Plans, CreatePlans, UpdatePlans } from "../models/plan";

// LISTAR TODOS OS PLANOS
export async function findAll(): Promise<Plans[]>{
    const {data, error} = await supabase.from("plans").select("*");

    if(error){
        throw error;
    }
    return data as Plans[];
}

// LISTA POR ID
// OBS = .eq = WHERE
export async function findById(id: string): Promise<Plans | null> {
    const {data, error} = await supabase.from("plans")
    .select("*")
    .eq("id", id)
    .maybeSingle();

    if(error){
        throw error;
    }
    return data as Plans | null;
}

// INSERE LINHA QUE NA TABELA JA EXISTE
export async function createPlans(plan: CreatePlans): Promise<Plans> {
    const {data, error} = await supabase.from("plans").insert(plan).select().single()

    if(error){
        throw error;
    }
    return data as Plans;
}

// ATUALIZAR
export async function update(
  id: string,
  plan: UpdatePlans
): Promise<Plans | null> {
  const { data, error } = await supabase
    .from("plans")
    .update(plan)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw error;

  return data as Plans | null;
}

// EXCLUIR
export async function remove(id: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("plans")
    .delete()
    .eq("id", id)
    .select();

  if (error) throw error;

  return data.length > 0;
}