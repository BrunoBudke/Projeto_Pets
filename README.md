# 🐾 Get A Pet — Frontend

Projeto de adoção de pets desenvolvido em **React**.

---

## 📁 Estrutura de Pastas

```
FrontEnd/
├── public/
│   └── index.html            # HTML base da aplicação
├── src/
│   ├── components/
│   │   ├── AdoptionFlow/
│   │   │   ├── AdoptionFlow.js   # Fluxo de adoção (3 etapas)
│   │   │   └── AdoptionFlow.css  # Estilos do fluxo de adoção
│   │   └── PetProfile/
│   │       ├── PetProfile.js     # Perfil individual do pet
│   │       └── PetProfile.css    # Estilos do perfil
│   ├── App.js                # Rotas da aplicação
│   └── index.js              # Ponto de entrada do React
├── package.json              # Dependências do projeto
└── README.md                 # Este arquivo
```

---

##  Como Rodar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado (versão 16 ou superior)
- npm (já vem com o Node)

### Passo a passo

```bash
# 1. Acesse a pasta do projeto
cd FrontEnd

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm start
```

O projeto abrirá automaticamente em **http://localhost:3000**

---

## 🗺️ Rotas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/pet/:id` | `PetProfile` | Perfil detalhado de um pet |
| `/adopt/:id` | `AdoptionFlow` | Fluxo de agendamento de visita |

---

## 🛠️ Tecnologias

- **React 18**
- **React Router DOM v6**
- **CSS customizado** (sem UI library)
- **Google Fonts** — Nunito

---


