# 🛠️ Instalação Completa - Atlas Acadêmico

## 📋 Pré-requisitos (Instalar TUDO)

### 1. Node.js (OBRIGATÓRIO)
```bash
# Baixar e instalar Node.js 18+ em:
# https://nodejs.org/
# Escolha a versão LTS (recomendada)
```

**Verificar se instalou:**
```bash
node --version
npm --version
```

### 2. Git (OBRIGATÓRIO)
```bash
# Baixar e instalar Git em:
# https://git-scm.com/download/windows
```

**Verificar se instalou:**
```bash
git --version
```

## 🚀 Instalação do Projeto

### 1. Clonar o repositório
```bash
git clone [URL-DO-SEU-REPOSITORIO]
cd atlasacademico-main
```

### 2. Instalar dependências do FRONTEND
```bash
# Na pasta raiz do projeto
npm install
```

### 3. Instalar dependências do BACKEND
```bash
cd backend
npm install
cd ..
```

### 4. Configurar arquivos .env
```bash
# Copiar arquivos de exemplo
copy .env.example .env
copy backend\.env.example backend\.env
```

### 5. Editar arquivos .env
**Arquivo: `.env` (raiz)**
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

**Arquivo: `backend\.env`**
```env
JWT_SECRET=sua-chave-secreta-aqui
PORT=3001
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 6. Executar o projeto
**Terminal 1 (Frontend):**
```bash
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd backend
npm run dev
```

## 🌐 Acessar o projeto
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001

## ❌ Sobre o arquivo bun.lockb
O arquivo `bun.lockb` é do **Bun** (alternativa ao npm). 
**IGNORE** este arquivo - use apenas **npm**.

## 🆘 Comandos de Emergência

### Se der erro de dependências:
```bash
# Deletar node_modules e reinstalar
rmdir /s node_modules
npm install

cd backend
rmdir /s node_modules  
npm install
cd ..
```

### Se der erro de porta ocupada:
```bash
# Ver o que está usando a porta
netstat -ano | findstr :5173
netstat -ano | findstr :3001

# Matar processo (substitua XXXX pelo PID)
taskkill /PID XXXX /F
```

### Limpar cache do npm:
```bash
npm cache clean --force
```

## 📞 Suporte
Se ainda não funcionar, verifique:
1. ✅ Node.js instalado (versão 18+)
2. ✅ Git instalado  
3. ✅ Executou `npm install` nas 2 pastas
4. ✅ Arquivos .env configurados
5. ✅ Portas 5173 e 3001 livres