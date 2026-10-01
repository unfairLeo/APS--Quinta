// IMPORTANDO
import express from "express";
import cors from "cors";
import { supabase } from "./config/supabase";
import planRoutes from "./routes/planRoutes";

const app = express();

app.use(cors());
app.use(express.json());
// USANDO ROTAS
app.use("/plans", planRoutes);


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

export default app;