Este projeto simula o site de uma clínica médica, com funcionalidades completas de front-end e back-end. Foi desenvolvido utilizando React com TypeScript no front-end, Node.js com TypeScript no back-end, e PostgreSQL como banco de dados relacional.

https://github.com/user-attachments/assets/c51edcb1-0725-4bcc-a4cf-9184a30f8c46


🔧 Tecnologias Utilizadas
### Front-end
- React (com arquivos .tsx)

- TypeScript

- Axios

- React Router


### Back-end
- Node.js

- Express

- TypeScript

- JWT (Autenticação)

- PostgreSQL

- Sequelize (ORM)

### 💡Funcionalidades
Público Geral
- Visualizar serviços oferecidos pela clínica

- Visualizar equipe médica

### Usuários autenticados
Login com autenticação via JWT

Administradores
- Criar, editar e excluir serviços

- Criar, editar e excluir membros da equipe

### 🔐 Autenticação
A autenticação é feita utilizando JSON Web Tokens (JWT). Ao fazer login, o usuário recebe um token que é utilizado para acessar rotas protegidas. O token também diferencia usuários comuns de administradores.
