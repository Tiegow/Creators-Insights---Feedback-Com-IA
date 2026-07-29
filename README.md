# 🎬 Creators Insights - Feedback Com IA

**Creators Insights** é uma plataforma SaaS desenvolvida para criadores de conteúdo do YouTube. O sistema sincroniza todos os comentários de um vídeo e, através da inteligência artificial, extrai relatórios de sentimentos, separa os comentários em destaques (positivos, neutros e negativos), e conta automaticamente dúvidas, sugestões e críticas.

---
<p align="center">
  <img src="screenshots/relatorio.png" alt="App Screenshot" width=980>
</p>

---

<p align="center">
  <img src="screenshots/dashboard.png" alt="App Screenshot" width=980>
</p>

## 🚀 Principais Funcionalidades

- **Sincronização com o YouTube**: Conecte o ID do seu vídeo e puxe os comentários publicados utilizando a API Oficial do YouTube.
- **Relatório de Inteligência Artificial**: Uma pipeline que envia todos os seus comentários para o Gemini e estrutura um JSON completo com os destaques.
- **Destaques por Sentimento**: Veja exatamente quais comentários reais resumem o sentimento Positivo, Neutro ou Negativo do seu público.
- **Categorização de Intenção**: Contadores inteligentes que separam "Sugestões", "Dúvidas" e "Problemas".
- **Dashboard Gerencial**: Acompanhe o histórico de todos os seus vídeos analisados e gerencie sua conta através de uma interface responsiva.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com tecnologias do ecossistema web:

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), React, Tailwind CSS v4, Lucide Icons, Recharts (Gráficos).
- **Backend**: API Routes do Next.js, Server Actions.
- **Banco de Dados**: PostgreSQL (hospedado na [Neon](https://neon.tech/)) com o ORM **Prisma**.
- **Background Jobs / Webhooks**: [Upstash QStash](https://upstash.com/) para garantir que vídeos com milhares de comentários não travem a aplicação enquanto a IA os processa no fundo.
- **Inteligência Artificial**: SDK Oficial do Google Gen AI (`gemini-flash-latest`).
- **Autenticação**: NextAuth (Google Provider).

---

## ⚙️ Como rodar o projeto localmente

Siga o passo a passo abaixo para rodar o ambiente de desenvolvimento na sua máquina.

### 1. Pré-requisitos
- Node.js (v18+)
- Uma conta no [Google Cloud Console](https://console.cloud.google.com/) (Para OAuth e API do YouTube)
- Uma conta no [Google AI Studio](https://aistudio.google.com/) (Para obter a chave do Gemini)
- Uma conta na [Upstash](https://upstash.com/) (Para QStash)
- Um banco de dados PostgreSQL (Recomendamos [Neon](https://neon.tech))

### 2. Clonando o Repositório
```bash
git clone https://github.com/SeuUsuario/creators-insights.git
cd creators-insights
```

### 3. Instalando as Dependências
```bash
npm install
```

### 4. Configurando Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto baseado no arquivo de exemplo e preencha as chaves:

```env
# Banco de Dados (Neon/PostgreSQL)
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/dbname"

# Autenticação (NextAuth)
AUTH_SECRET="um_segredo_aleatorio_bem_seguro"
AUTH_GOOGLE_ID="seu_client_id_do_google"
AUTH_GOOGLE_SECRET="seu_client_secret_do_google"

# APIs do Google (YouTube & Gemini)
YOUTUBE_API_KEY="sua_chave_de_api_do_youtube"
GEMINI_API_KEY="sua_chave_do_google_ai_studio"

# Filas / Background Jobs (Upstash QStash)
QSTASH_URL="https://qstash.upstash.io/v2/publish"
QSTASH_TOKEN="seu_token_qstash"
QSTASH_CURRENT_SIGNING_KEY="sua_current_key"
QSTASH_NEXT_SIGNING_KEY="sua_next_key"

# URL Base (Mude para o seu domínio em produção)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Configurando o Banco de Dados
Sincronize o Prisma com o seu banco PostgreSQL vazio:
```bash
npx prisma db push
```

### 6. Rodando a Aplicação
Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
Acesse `http://localhost:3000` no seu navegador e teste!