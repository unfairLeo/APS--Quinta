/* model = É uma descrição do formato dos dados. Ele diz ao TypeScript: "um Plano tem estes campos, com estes tipos". 
Não acessa o banco nem tem lógica, só descreve. Em TypeScript isso se faz com uma interface.*/

// TABELA PLAN - BANCO
export interface Plans {
    id: string;
    name:string;
    description: string | null; 
    price: number;
    monthly_token_limit: number;
    active: boolean;
}

//Description É nulo porque definimos essa coluna sem notn null

//Pega a interface Plans e omite o id
export type CreatePlans = Omit<Plans, "id">

// Torna opcional
export type UpdatePlans = Partial<CreatePlans>