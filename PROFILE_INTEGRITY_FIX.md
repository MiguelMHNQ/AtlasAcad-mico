# Correção: Usuários Órfãos no Auth

## Problema
Quando um perfil é deletado da tabela `profiles`, o usuário permanece na tabela `auth.users` do Supabase, permitindo login sem perfil válido.

## Solução Implementada

### 1. Verificação Automática no Frontend
- **AuthContext**: Modificado para fazer logout automático quando não encontrar perfil
- **ProtectedRoute**: Agora verifica tanto `user` quanto `profile` antes de permitir acesso
- **useProfileIntegrity**: Hook que verifica integridade do perfil periodicamente

### 2. Melhorias na Função deleteAccount
- Ordem correta de deleção (dados relacionados → perfil → auth user)
- Tentativa de remoção do usuário do auth (requer privilégios admin)

### 3. Script SQL para Supabase
Execute o arquivo `supabase-cleanup.sql` no SQL Editor do Supabase para:
- Criar trigger automático que remove usuário do auth quando perfil é deletado
- Limpar usuários órfãos existentes
- Configurar políticas RLS adequadas

## Como Aplicar a Correção

### Passo 1: Executar SQL no Supabase
1. Acesse o Supabase Dashboard
2. Vá em SQL Editor
3. Execute o conteúdo do arquivo `supabase-cleanup.sql`

### Passo 2: Verificar Funcionamento
1. Teste deletar um perfil
2. Verifique se o usuário é removido automaticamente do auth
3. Teste login com usuário que teve perfil deletado

## Comportamento Esperado

### Antes da Correção
- Usuário faz login mesmo sem perfil
- Aplicação quebra ao tentar acessar dados do perfil
- Usuário fica "preso" no sistema

### Depois da Correção
- Usuário sem perfil é automaticamente deslogado
- Mensagem clara sobre perfil não encontrado
- Redirecionamento automático para login
- Limpeza automática de usuários órfãos

## Arquivos Modificados
- `src/contexts/AuthContext.tsx`
- `src/components/ProtectedRoute.tsx` 
- `src/components/dashboard/DashboardLayout.tsx`
- `src/hooks/useProfileIntegrity.ts` (novo)
- `supabase-cleanup.sql` (novo)

## Monitoramento
Para verificar se há usuários órfãos:
```sql
SELECT COUNT(*) as usuarios_orfaos
FROM auth.users au 
LEFT JOIN profiles p ON au.id = p.user_id 
WHERE p.user_id IS NULL;
```