# API REST com Express

Uma API RESTful construída com Express.js, apresentando autenticação de usuários, controle de acesso baseado em funções e persistência em arquivos JSON.

## Funcionalidades

- Autenticação de usuários com JWT
- Controle de acesso baseado em funções (Admin/Usuário)
- Armazenamento em arquivos JSON
- Documentação da API com Swagger
- Middleware para tratamento de erros
- Validação de entradas
- Suporte a CORS

## Pré-requisitos

- Node.js (v14 ou superior)
- npm

## Instalação

1. Clone o repositório.
2. Instale as dependências:
```bash
npm install
```
3. Crie um arquivo `.env` no diretório raiz com as seguintes variáveis:
```
PORT=3000
JWT_SECRET=sua-chave-secreta-aqui
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## Começando

1. Instale o sistema (cria um usuário administrador):
```bash
GET http://localhost:3000/install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Documentação da API

Acesse a documentação Swagger em:
```
http://localhost:3000/docs
```

## Endpoints da API

### Autenticação

- `POST /api/auth/register` - Registrar um novo usuário
  ```json
  {
    "username": "usuario",
    "password": "senha123",
    "email": "usuario@exemplo.com"
  }
  ```

- `POST /api/auth/login` - Fazer login e obter o token JWT
  ```json
  {
    "username": "usuario",
    "password": "senha123"
  }
  ```

### Usuários

Todos os endpoints abaixo requerem o cabeçalho de autenticação:
```
Authorization: Bearer <jwt_token>
```

- `GET /api/users` - Listar usuários (apenas Admin)
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Excluir usuário (apenas Admin)

## Tratamento de Erros

A API utiliza um sistema de tratamento de erros personalizados com os códigos HTTP apropriados:

- 400: Requisição Inválida
- 401: Não Autorizado
- 403: Proibido
- 404: Não Encontrado
- 500: Erro Interno do Servidor

## Desenvolvimento

Execute o servidor de desenvolvimento com recarga automática:
```bash
npm run dev
```

Execute os testes:
```bash
npm test
```

Gere a documentação da API:
```bash
npm run docs
