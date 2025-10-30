import { supabase } from "@/integrations/supabase/client";

export { supabase };

export type Profile = {
  id: string;
  user_id: string;
  nome: string;
  cpf: string | null;
  tipo_perfil: "Estudante" | "Professor";
  badges: string[];
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};