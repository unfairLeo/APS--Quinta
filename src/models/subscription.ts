// MODEL SUBSCRIPTION = formato dos dados da tabela "subscriptions"
export type SubscriptionStatus = "active" | "canceled" | "expired";

export interface Subscriptions {
    id: string;
    user_id: string; // FK -> users(id)
    plan_id: string; // FK -> plans(id)
    status: SubscriptionStatus;
    started_at: string; // gerado pelo banco (now())
    renewal_date: string | null; // pode ser nulo (coluna sem not null)
}

// Dados para CRIAR uma assinatura (id e started_at são gerados pelo banco)
export type CreateSubscriptions = Omit<Subscriptions, "id" | "started_at">;

// Dados para ATUALIZAR uma assinatura (todos opcionais)
export type UpdateSubscriptions = Partial<CreateSubscriptions>;