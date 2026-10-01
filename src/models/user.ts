// MODEL USER = formato dos dados da tabela "users"
export interface Users {
    id: string;
    name: string;
    email: string;
    active: boolean;
}

// Dados para CRIAR um usuário (o id é gerado pelo banco)
export type CreateUsers = Omit<Users, "id">;

// Dados para ATUALIZAR um usuário (todos opcionais)
export type UpdateUsers = Partial<CreateUsers>;