# 🐾 Get A Pet — Frontend

Interface React para o sistema de adoção de pets.

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- Backend rodando em **http://localhost:5000** (ver `getapet-backend/`)

---

## 🚀 Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar em desenvolvimento
npm start
```

Abre automaticamente em: **http://localhost:3000**

---

## 📄 Páginas

| Rota | Página | Auth |
|------|--------|------|
| `/` | Home — lista de pets para adoção | ❌ |
| `/explore` | Explorar raças + curiosidades (3 APIs) | ❌ |
| `/login` | Login | ❌ |
| `/register` | Cadastro | ❌ |
| `/pet/:id` | Perfil do pet | ❌ |
| `/adopt/:id` | Fluxo de adoção (3 passos) | ✅ |
| `/addpet` | Cadastrar pet | ✅ |
| `/mypets` | Gerenciar meus pets | ✅ |

---

## 🌐 APIs externas usadas na página Explorar

| API | Dados | Doc |
|-----|-------|-----|
| Dog CEO API | Imagens das raças | https://dog.ceo/dog-api |
| dogapi.dog | Características das raças + curiosidades | https://dogapi.dog |
| MyMemory | Tradução EN → PT-BR | https://mymemory.translated.net |

---

## 📁 Estrutura

```
getapet-frontend/
├── public/
│   └── index.html
└── src/
    ├── App.js
    ├── context/        ← UserContext (autenticação global)
    ├── hooks/          ← useAuth, useFlashMessage
    ├── utils/          ← api.js (axios), bus.js (eventos)
    └── components/
        ├── layout/     ← Navbar, FlashMessage
        ├── Home/       ← Página inicial
        └── pages/
            ├── Auth/   ← Login, Register
            ├── Explore/← Pesquisa de raças (3 APIs)
            └── Pet/    ← PetProfile, AdoptionFlow, AddPet, MyPets
```
