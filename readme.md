--- LEONARDO RAVACHE E FELIPE RIGONATO

1. Objetivo

API REST para gerenciar planos de um serviço de IA (Free, Pro, Team) e as assinaturas dos clientes. Um plano tem várias assinaturas, e cada assinatura pertence a um plano.

2. Stack
Node.js + TypeScript + Express
Supabase (PostgreSQL)
Git/GitHub
Bibliotecas extras: dotenv, cors, @supabase/supabase-js


4. Banco de dados vamos utilizar o supabase na aplicação

5. Estrutura do projeto
src/
├── config/          # conexão com o Supabase
├── models/          # tipos/interfaces (Plan, Subscription)
├── repositories/    # acesso ao banco (queries)
├── controllers/     # regras, validações e respostas HTTP
├── routes/          # definição das rotas
├── app.ts           # configuração do Express
└── server.ts        # inicia o servidor

Fluxo: Route → Controller → Repository → Supabase

- package.json = npm instalado

npm.cmd install express cors dotenv @supabase/supabase-js 
- Guarda as versões exatas que foram realmente instaladas
 - instala o supabase

 _________________________________________________________________________________________________
 No app.ts:

Por que o express.json() é necessário? O que acontece com o req.body sem ele?
O que é um middleware, e quais dois existem aqui?
Por que a rota /health usa async e await?
Por que o return antes do res.status(500)?
Por que o arquivo termina com export default app em vez de ligar o servidor?

No server.ts:

Por que o dotenv.config() aparece de novo, se já existe no supabase.ts?
O que o process.env.PORT || 3000 faz?
O que acontece quando o app.listen roda?
______________________________________________________________________________________________________
CONCEITOS:
MODEL = É uma descrição do formato dos dados. Ele diz ao TypeScript "um Plano tem estes campos, com estes tipos".
_______________________________________________________________________________________________________
----------------- Ordem dentro de cada entidade: ------------
Etapa	Arquivo	O que faz:

5. Model ->  models/Plan.ts  -> 	Define o formato dos dados (uma interface TypeScript)

6. Repository -> repositories/PlanRepository.ts  ->	Faz as consultas ao Supabase (listar, buscar, inserir, atualizar, excluir)

7. Controller  -> controllers/PlanController.ts  -> Valida os dados, aplica as regras e responde com o código HTTP certo

8. Routes	routes/planRoutes.ts	Liga cada método e endereço ao controller