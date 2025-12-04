-- Função para limpar usuários órfãos do auth quando perfil é deletado
-- Execute este SQL no Supabase SQL Editor

-- 1. Criar função para deletar usuário do auth quando perfil é removido
CREATE OR REPLACE FUNCTION delete_auth_user_on_profile_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Deletar usuário do auth.users quando perfil é removido
  DELETE FROM auth.users WHERE id = OLD.user_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Criar trigger que executa a função quando um perfil é deletado
DROP TRIGGER IF EXISTS trigger_delete_auth_user ON profiles;
CREATE TRIGGER trigger_delete_auth_user
  AFTER DELETE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION delete_auth_user_on_profile_delete();

-- 3. Função para limpar usuários órfãos existentes (executar uma vez)
CREATE OR REPLACE FUNCTION cleanup_orphaned_auth_users()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER := 0;
  user_record RECORD;
BEGIN
  -- Encontrar usuários no auth.users que não têm perfil correspondente
  FOR user_record IN 
    SELECT au.id 
    FROM auth.users au 
    LEFT JOIN profiles p ON au.id = p.user_id 
    WHERE p.user_id IS NULL
  LOOP
    -- Deletar usuário órfão
    DELETE FROM auth.users WHERE id = user_record.id;
    deleted_count := deleted_count + 1;
  END LOOP;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Executar limpeza de usuários órfãos existentes
SELECT cleanup_orphaned_auth_users() as usuarios_orfaos_removidos;

-- 5. Política RLS para permitir que usuários deletem seus próprios dados
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Permitir que usuários vejam e editem apenas seus próprios perfis
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Permitir inserção de novos perfis
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);