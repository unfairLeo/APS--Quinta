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