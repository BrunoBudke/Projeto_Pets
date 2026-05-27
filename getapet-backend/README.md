#  Get A Pet — Backend

API RESTful para sistema de adoção de pets.

---

##  Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) rodando localmente **ou** uma string de conexão do [MongoDB Atlas](https://www.mongodb.com/atlas)

---

##  Como rodar

```bash

npm install

npm run dev


npm start
```

O servidor sobe em: **http://localhost:5000**

---

##  Testes e Cobertura (Jest)


npm test


---

##  Análise de Código (ESLint)

```bash
npm run lint
```

---

## 📋 Endpoints da API

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/users/register` |  | Cadastro de usuário |
| POST | `/users/login` |  | Login (retorna JWT) |
| GET | `/users/profile` |  | Perfil do usuário logado |
| GET | `/pets` |  | Listar todos os pets |
| GET | `/pets/:id` |  | Detalhes de um pet |
| GET | `/pets/mypets` |  | Pets do usuário logado |
| POST | `/pets` |  | Cadastrar pet |
| PUT | `/pets/:id` |  | Atualizar pet (só tutor) |
| DELETE | `/pets/:id` | | Remover pet (só tutor) |
| PATCH | `/pets/:id/adopt` |  | Adotar pet |

---

