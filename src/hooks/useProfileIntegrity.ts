import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useProfileIntegrity() {
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    if (!user || !supabase) return;

    const checkProfileIntegrity = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking profile integrity:', error);
          return;
        }

        // Se usuário está logado mas não tem perfil
        if (!data) {
          console.warn('User authenticated but no profile found, signing out');
          toast.error('Perfil não encontrado. Redirecionando para login...');
          await signOut();
        }
      } catch (error) {
        console.error('Profile integrity check failed:', error);
      }
    };

    // Verificar integridade após 1 segundo do login
    const timeoutId = setTimeout(checkProfileIntegrity, 1000);

    return () => clearTimeout(timeoutId);
  }, [user, profile, signOut]);
}