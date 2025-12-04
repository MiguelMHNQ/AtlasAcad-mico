import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Credenciais do Supabase não encontradas!');
}

let supabaseInstance: any = null;

if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: 'atlas-auth',
        storage: window.localStorage
      }
    });
    console.log('✅ Supabase conectado');
  } catch (error) {
    console.error('❌ Erro ao conectar com Supabase:', error);
  }
}

export const supabase = supabaseInstance

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

const cache = new Map<string, { data: any[], timestamp: number }>();
const CACHE_DURATION = 60000;
const REQUEST_TIMEOUT = 8000;

export const getSupabaseData = async (table: string): Promise<any[]> => {
  try {
    if (!supabase) return [];
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const cacheKey = `${table}_${user.id}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), REQUEST_TIMEOUT)
    );
    
    const queryPromise = supabase
      .from(table)
      .select('*')
      .eq('user_id', user.id)
      .limit(50);
    
    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);
    
    if (error) {
      return cached ? cached.data : [];
    }
    
    const result = data || [];
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    
    return result;
  } catch (error) {
    const cacheKey = `${table}_${user?.id}`;
    const cached = cache.get(cacheKey);
    return cached ? cached.data : [];
  }
};

export const addSupabaseItem = async (table: string, item: any): Promise<any> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const itemWithUser = { ...item, user_id: user.id };
    
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Insert timeout')), REQUEST_TIMEOUT)
    );
    
    const insertPromise = supabase
      .from(table)
      .insert(itemWithUser)
      .select()
      .single();
    
    const { data, error } = await Promise.race([insertPromise, timeoutPromise]);
    
    if (error) throw error;
    
    const cacheKey = `${table}_${user.id}`;
    cache.delete(cacheKey);
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteSupabaseItem = async (table: string, id: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Delete timeout')), REQUEST_TIMEOUT)
    );
    
    const deletePromise = supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    const { error } = await Promise.race([deletePromise, timeoutPromise]);
    
    if (error) throw error;
    
    if (user) {
      const cacheKey = `${table}_${user.id}`;
      cache.delete(cacheKey);
    }
  } catch (error) {
    throw error;
  }
};