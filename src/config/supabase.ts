// IMPORTANDO ARQUIVOS
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// CHAMANDO O DOT ENV PARA MECHER NAS VARIAVEIS DO NOSSO ENV
dotenv.config();

// CRIANDO VARIAVEIS REFERENCIANDO AO ENV
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

// VERIFICANDO SE A VARIAVEL EXISTE REALMENTE NO ENV
if (!supabaseUrl || !supabaseSecretKey) {
    console.error("Erro: Variáveis de ambiente do Supabase não encontradas.");
    process.exit(1);

}

// CRIANDO A CONEXÃO COM O BANCO
export const supabase = createClient(supabaseUrl, supabaseSecretKey);