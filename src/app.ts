// IMPORTANDO
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { supabase } from "./config/supabase";
import planRoutes from "./routes/planRoutes";
import userRoutes from "./routes/userRoutes";
import subscriptionRoutes from "./routes/subscriptionRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// USANDO ROTAS
app.use("/plans", planRoutes);
app.use("/users", userRoutes);
app.use("/subscriptions", subscriptionRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API de Planos e Assinaturas funcionando" });
});

app.get("/health", async (req, res) => {
  const { error } = await supabase.from("plans").select("id").limit(1);

  if (error) {
    return res.status(500).json({ status: "erro", detalhe: error.message });
  }

  res.json({ status: "ok", banco: "conectado" });
});

// ROTA NÃO ENCONTRADA (404 em JSON)
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// TRATAMENTO DE ERROS GLOBAL (precisa ser o último middleware)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ error: "JSON inválido" });
  }
  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

export default app;