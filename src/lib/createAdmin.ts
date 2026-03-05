import { supabase } from './supabase';

export async function createAdminUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.functions.invoke('create-admin', {
      body: { email, password },
    });

    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Failed to create admin:', error);
    return { success: false, error: error.message };
  }
}
