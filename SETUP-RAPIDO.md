# 🚀 Setup Rápido - Atlas Acadêmico

## 📋 Pré-requisitos
- Node.js 18+
- npm ou yarn

## ⚡ Instalação Rápida

### 1. Clone e instale dependências
```bash
git clone [seu-repositorio]
cd atlasacademico-main
npm install
cd backend && npm install
```

### 2. Configure o Supabase
```bash
# Copie o arquivo de exemplo
cp .env.example .env
cp backend/.env.example backend/.env
```

### 3. Edite os arquivos .env
**Arquivo raiz (.env):**
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

**Arquivo backend/.env:**
```env
JWT_SECRET=sua-chave-secreta
PORT=3001
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Execute o projeto
```bash
# Terminal 1 - Frontend (na pasta raiz)
npm run dev

# Terminal 2 - Backend (em nova aba/terminal)
cd backend
npm run dev
```

## 🚫 Erros Comuns

### Erro: "Cannot find package 'lovable-tagger'"
**Solução:** Já corrigido no vite.config.ts

### Erro: "Failed to resolve import @/components"
**Solução:**
```bash
# Deletar node_modules e reinstalar
rmdir /s node_modules
npm install

# Se ainda não funcionar, limpar cache
npm run dev -- --force
```

### Erro: "EADDRINUSE port 3001"
**Solução:**
```bash
# Matar processo na porta 3001
netstat -ano | findstr :3001
taskkill /PID [numero_do_pid] /F
```

### 5. Acesse
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## 🔧 Configuração do Supabase

1. Crie conta em https://supabase.com
2. Crie novo projeto
3. Vá em Settings > API
4. Copie URL e anon key
5. Cole nos arquivos .env

## ✅ Pronto!
O Atlas Acadêmico estará rodando!