-- Atlas Acadêmico - Setup do Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Criar tabela de perfis
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cpf TEXT,
  tipo_perfil TEXT NOT NULL CHECK (tipo_perfil IN ('Estudante', 'Professor')),
  badges JSONB DEFAULT '[]'::jsonb,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela de experiências
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  empresa TEXT NOT NULL,
  cargo TEXT NOT NULL,
  periodo TEXT,
  descricao TEXT,
  localizacao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar tabela de educação
CREATE TABLE IF NOT EXISTS education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  instituicao TEXT NOT NULL,
  curso TEXT NOT NULL,
  grau TEXT,
  periodo TEXT,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Criar tabela de projetos
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  tecnologias JSONB DEFAULT '[]'::jsonb,
  link TEXT,
  status TEXT DEFAULT 'Em andamento',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Criar tabela de idiomas
CREATE TABLE IF NOT EXISTS languages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  idioma TEXT NOT NULL,
  nivel TEXT NOT NULL CHECK (nivel IN ('Básico', 'Intermediário', 'Avançado', 'Fluente', 'Nativo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Criar tabela de certificados
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  instituicao TEXT NOT NULL,
  data_emissao DATE,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Criar tabela de publicações
CREATE TABLE IF NOT EXISTS publications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  autores TEXT,
  revista TEXT,
  data_publicacao DATE,
  doi TEXT,
  resumo TEXT,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

-- 9. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Usuários podem ver todos os perfis" ON profiles;
DROP POLICY IF EXISTS "Usuários podem inserir seu próprio perfil" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON profiles;
DROP POLICY IF EXISTS "Usuários podem deletar seu próprio perfil" ON profiles;

-- Políticas de segurança para profiles
CREATE POLICY "profiles_select_policy" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_policy" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update_policy" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "profiles_delete_policy" ON profiles FOR DELETE USING (auth.uid() = user_id);

-- 10. Políticas para experiences
DROP POLICY IF EXISTS "Usuários podem ver todas as experiências" ON experiences;
DROP POLICY IF EXISTS "Usuários podem inserir suas próprias experiências" ON experiences;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias experiências" ON experiences;
DROP POLICY IF EXISTS "Usuários podem deletar suas próprias experiências" ON experiences;

CREATE POLICY "experiences_select_policy" ON experiences FOR SELECT USING (true);
CREATE POLICY "experiences_insert_policy" ON experiences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "experiences_update_policy" ON experiences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "experiences_delete_policy" ON experiences FOR DELETE USING (auth.uid() = user_id);

-- 11. Políticas para education
DROP POLICY IF EXISTS "Usuários podem ver toda educação" ON education;
DROP POLICY IF EXISTS "Usuários podem inserir sua própria educação" ON education;
DROP POLICY IF EXISTS "Usuários podem atualizar sua própria educação" ON education;
DROP POLICY IF EXISTS "Usuários podem deletar sua própria educação" ON education;

CREATE POLICY "education_select_policy" ON education FOR SELECT USING (true);
CREATE POLICY "education_insert_policy" ON education FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "education_update_policy" ON education FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "education_delete_policy" ON education FOR DELETE USING (auth.uid() = user_id);

-- 12. Políticas para projects
DROP POLICY IF EXISTS "Usuários podem ver todos os projetos" ON projects;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios projetos" ON projects;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios projetos" ON projects;
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios projetos" ON projects;

CREATE POLICY "projects_select_policy" ON projects FOR SELECT USING (true);
CREATE POLICY "projects_insert_policy" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "projects_update_policy" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "projects_delete_policy" ON projects FOR DELETE USING (auth.uid() = user_id);

-- 13. Políticas para languages
DROP POLICY IF EXISTS "Usuários podem ver todos os idiomas" ON languages;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios idiomas" ON languages;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios idiomas" ON languages;
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios idiomas" ON languages;

CREATE POLICY "languages_select_policy" ON languages FOR SELECT USING (true);
CREATE POLICY "languages_insert_policy" ON languages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "languages_update_policy" ON languages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "languages_delete_policy" ON languages FOR DELETE USING (auth.uid() = user_id);

-- 14. Políticas para certificates
DROP POLICY IF EXISTS "Usuários podem ver todos os certificados" ON certificates;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios certificados" ON certificates;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios certificados" ON certificates;
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios certificados" ON certificates;

CREATE POLICY "certificates_select_policy" ON certificates FOR SELECT USING (true);
CREATE POLICY "certificates_insert_policy" ON certificates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "certificates_update_policy" ON certificates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "certificates_delete_policy" ON certificates FOR DELETE USING (auth.uid() = user_id);

-- 15. Políticas para publications
DROP POLICY IF EXISTS "Usuários podem ver todas as publicações" ON publications;
DROP POLICY IF EXISTS "Usuários podem inserir suas próprias publicações" ON publications;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias publicações" ON publications;
DROP POLICY IF EXISTS "Usuários podem deletar suas próprias publicações" ON publications;

CREATE POLICY "publications_select_policy" ON publications FOR SELECT USING (true);
CREATE POLICY "publications_insert_policy" ON publications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "publications_update_policy" ON publications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "publications_delete_policy" ON publications FOR DELETE USING (auth.uid() = user_id);

-- 16. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 17. Trigger para atualizar updated_at na tabela profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();