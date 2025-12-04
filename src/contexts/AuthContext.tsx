import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type Profile = {
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

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, nome: string, cpf: string, tipo_perfil: "Estudante" | "Professor") => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  deleteAccount: () => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    let sessionCheckTimeout: NodeJS.Timeout;

    const initAuth = async () => {
      if (!supabase || !mounted) {
        setLoading(false);
        return;
      }

      try {
        // Quick session check with timeout for free tier
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 3000)
        );

        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (mounted) {
          setUser(session?.user ?? null);
          if (session?.user) {
            await fetchProfile(session.user.id);
          }
        }
      } catch (error) {
        console.warn('Session check failed, using cached state:', error);
        // Don't clear user state on timeout - keep existing session if any
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Initialize auth state
    initAuth();

    // Listen for auth changes with debouncing
    let subscription: any;
    if (supabase) {
      try {
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (!mounted) return;
          
          console.log('Auth state changed:', event);
          
          // Debounce rapid auth changes
          clearTimeout(sessionCheckTimeout);
          sessionCheckTimeout = setTimeout(async () => {
            if (!mounted) return;
            
            setUser(session?.user ?? null);
            if (session?.user) {
              await fetchProfile(session.user.id);
            } else {
              setProfile(null);
            }
          }, 100);
        });
        subscription = data.subscription;
      } catch (error) {
        console.error('Error setting up auth listener:', error);
        setLoading(false);
      }
    }

    return () => {
      mounted = false;
      clearTimeout(sessionCheckTimeout);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for userId:', userId);
      
      // Add timeout for free tier
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
      );

      const { data, error } = await Promise.race([profilePromise, timeoutPromise]);

      if (error) {
        console.warn('Profile fetch error:', error.message);
        // Don't clear profile on error - keep existing if any
        return;
      }

      setProfile(data);
      console.log('Profile set:', data);
    } catch (error) {
      console.warn('Profile fetch failed:', error);
      // Don't clear profile on timeout - keep existing session
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!supabase) {
        return { error: { message: "Supabase não configurado. Verifique as credenciais no .env" } };
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
      return { error: null };
    } catch (error) {
      console.error('Erro no login:', error);
      return { error: { message: "Erro de conexão com Supabase. Verifique sua internet e configurações." } };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    nome: string,
    cpf: string,
    tipo_perfil: "Estudante" | "Professor"
  ) => {
    try {
      if (!supabase) {
        return { error: { message: "Supabase não configurado. Verifique as credenciais no .env" } };
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        // Create profile immediately
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            nome,
            cpf,
            tipo_perfil,
            badges: [],
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          toast.error("Erro ao criar perfil. Verifique se executou o script SQL no Supabase.");
          return { error: profileError };
        }

        // Fetch the created profile
        await fetchProfile(data.user.id);
        
        toast.success("Cadastro realizado com sucesso!");
        navigate("/dashboard");
      }

      return { error: null };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return { error: { message: "Erro de conexão com Supabase. Verifique se executou o script SQL." } };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    toast.success("Logout realizado com sucesso!");
    navigate("/login");
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) {
      return { error: new Error("Not authenticated") };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        return { error };
      }

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return { error: null };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { error };
    }
  };

  const deleteAccount = async () => {
    if (!user) {
      return { error: new Error("Not authenticated") };
    }

    try {
      // Delete all user data from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
      }

      // Delete all related data
      const tables = ['experiences', 'education', 'projects', 'languages', 'certificates', 'publications'];
      
      for (const table of tables) {
        await supabase
          .from(table)
          .delete()
          .eq('user_id', user.id);
      }

      // Sign out user
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      
      toast.success("Conta apagada com sucesso!");
      navigate("/login");
      
      return { error: null };
    } catch (error) {
      console.error('Erro ao apagar conta:', error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}