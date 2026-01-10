import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  checkAdmin: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  isAdmin: false,
  
  login: (user: User) => {
    set({ user });
    get().checkAdmin();
  },
  
  logout: () => set({ user: null, isAdmin: false }),
  
  setLoading: (loading: boolean) => set({ loading }),
  
  checkAdmin: async () => {
    const { user } = get();
    if (!user?.email) {
      set({ isAdmin: false });
      return false;
    }
    
    const { data } = await supabase
      .from('admins')
      .select('email')
      .eq('email', user.email)
      .single();
    
    const isAdmin = !!data;
    set({ isAdmin });
    return isAdmin;
  },
}));
